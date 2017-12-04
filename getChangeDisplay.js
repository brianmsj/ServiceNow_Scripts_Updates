//Script Include
//Name: getChangeConflicts
//Client Callable: True
var getChangeConflicts = Class.create();
getChangeConflicts.prototype = Object.extendsObject(AbstractAjaxProcessor, {

	getChangeRequests:function(){

		var cmdbCI    = this.getParameter('sysparm_cmdbCI');
		var startDate = this.getParameter('sysparm_startDate');
		var endDate   = this.getParameter('sysparm_endDate');
		var change    = new GlideRecord('change_request');
			change.initialize();
			change.addQuery('active', true);
			change.addQuery('cmdb_ci', cmdbCI);
			change.query();

		var changeArray = [];

		while(change.next()){
		var changeStart = change.start_date.getDisplayValue();
		var changeEnd   = change.end_date.getDisplayValue();
		if(changeStart < startDate && changeEnd > startDate){
			var changeObject  = {};
			changeObject.number      = change.getDisplayValue('number');
			changeObject.changeStart = changeStart;
			changeObject.changeEnd   = changeEnd;
			changeArray.push(changeObject);
			}
		}
			var json = new JSON();
			var data = json.encode(changeArray);

			return data;

	},
    type: 'getChangeConflicts'
});

//Catalog Client Script
//UI Type: All
//onChange of CI Lookup Select Box
function onChange(control, oldValue, newValue, isLoading) {
   if (isLoading || newValue == '') {
      return;
   }
	if(oldValue != newValue){
		g_form.hideErrorBox('cmdb_ci');
	}

	var ga = new GlideAjax('getChangeConflicts');
	ga.addParam('sysparm_name', 'getChangeRequests');
	ga.addParam('sysparm_cmdbCI', g_form.getValue('cmdb_ci'));
	ga.addParam('sysparm_startDate', g_form.getValue('start_date'));
	ga.addParam('sysparm_endDate', g_form.getValue('end_date'));
	ga.getXML(callBack);

	function callBack(response) {
		var answer = response.responseXML.documentElement.getAttribute("answer");
		answer = JSON.parse(answer);
		for(var i = 0; i < answer.length; i++){
			g_form.addInfoMessage('Conflict with Change Request: ' + answer[i].number + ' - '+ 'Scheduled Start: ' + answer[i].changeStart);
		}
	}
}
