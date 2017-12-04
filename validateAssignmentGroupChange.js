function onChange(control, oldValue, newValue, isLoading, isTemplate) {
	if (isLoading || newValue === '') {
		return;
	}
	// If assignment group changes the assign to membership is validated.
	// If the assign to person is not a member of the new group then
	// the assign to field is nulled out
	var grpmem = new GlideAjax('HM_Client_Ajax_Scripts_01');
	grpmem.addParam('sysparm_name','isUserInGroup');
	grpmem.addParam('sysparm_curUserID',g_form.getValue('assigned_to'));
	grpmem.addParam('sysparm_GrpName',g_form.getDisplayBox('assignment_group').value);
	grpmem.getXML(fncBoolean);
	function fncBoolean(response) {
		var strBoolean = response.responseXML.documentElement.getAttribute("answer");
		if (strBoolean == 'false') {
			g_form.setValue('assigned_to','');
		}
	}
}
var HM_Client_Ajax_Scripts_01 = Class.create();
HM_Client_Ajax_Scripts_01.prototype = Object.extendsObject(AbstractAjaxProcessor, {
//******************************************************************************************
//The script below uses the current users ID and an group name to establish if the user is a
//member of the group. If the user is a member or the group has a facilities_vendor type then
//true" is returned, otherwise "false" is returned.  Called on a facilities request / task
//when an assignment group changes.
//******************************************************************************************
	isUserInGroup: function() {
		// Static variables and parameters
		var strGroupMember = "";
		var CurUserID = this.getParameter('sysparm_curUserID');
		var GrpName = this.getParameter('sysparm_GrpName');
		var grGrp = new GlideRecord('sys_user_group');
		grGrp.addQuery ('name',GrpName);
		grGrp.query();
		grGrp.next();
		var grQryStrPre = 'group='+grGrp.sys_id+'^user='+CurUserID;
		// BEGIN LOGIC - Retrieve child records using the tables parent field
		var grMem = new GlideRecord('sys_user_grmember');
		grMem.addEncodedQuery(grQryStrPre);
		grMem.query();
		grMem.next();
		// Add query is used to check a muti-select field on the parent record
		if ((grMem.sys_id != null) || (grMem.addQuery ('group.type','CONTAINS','250c6111df232100dca6a5f59bf263ee'))){
			strGroupMember = 'true';
		} else {
			strGroupMember = 'false';
		}
		return strGroupMember;
	},
	type: 'HM_Client_Ajax_Scripts_01'
});
