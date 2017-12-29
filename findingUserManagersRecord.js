// This script should be created as a trnasformation map script
// onComplete ordered after any onStart or onBefore scripts for LDAP
// or Active directory users.
// BE SURE TO MAP THE LDAP / ACTIVE DIRECTORY MNAGAER FIELD TO
// A FIELD IN sys_user TABLE. In this example an u_ldap_manager field was
// created, string(400). ALSO EXTEND THE FIELD LENGTH FOR THE MANAGER IN
// IMPORT SET TABLE TO 400. The script below parses the manager's name
// out of the imported field string the identifies the managers sys_id
// then updates the manager field on the user record.


(function runTransformScript(source, map, log, target /*undefined onStart*/ ){
// Apply Managers to each User record using LDAP manager string
var grUsers = new GlideRecord ('sys_user');
//grUsers.addQuery();
grUsers.query();
while (grUsers.next()){
	if (grUsers.u_ldap_manager != ''){
		var strLDAPMgr =  grUsers.u_ldap_manager;
		var arrLDAPMgr = strLDAPMgr.split(',');
		var strFirstName = arrLDAPMgr[1].substr(1,39);
		var strLastName = arrLDAPMgr[0].replace('CN=','');
		//target.u_ldap_manager = strFirstName+' '+strLastName.replace(String.fromCharCode(92),''); //for testing
		var strMgrName = strFirstName+' '+strLastName.replace(String.fromCharCode(92),'');
		var grMGR = new GlideRecord('sys_user');
		grMGR.addQuery('name',strMgrName);
		grMGR.query();
		if (grMGR.next()){
			grUsers.manager = grMGR.sys_id;
			grUsers.update();
		}
	}
}
})(source, map, log, target);

gs.users.query()
gs.uers.string()
