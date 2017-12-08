// example displays change task attachments on a change request

//Applies to table: Change Request (change_request) -- (parent)
//Queries from table:  Attachment (sys_attachment) -- (current)

//Related List - Change Task Attachments appear on Change Request
//Scripts uses table sys id for the change task table

(function refineQuery(current, parent) {
	var qc = current.addQuery('table_sys_id','d2077c614f30120021c382818110c7b0');
	var items = '';
	var gr = new GlideRecord('change_task');
	gr.addQuery('change_request', parent.sys_id); // we can not use an encoded query here and filter by created on date
	gr.query();
	while(gr.next()){
		items = items + ',' + gr.sys_id.toString();
	}
	if(items != ''){
		// uses custom field on change request u_wip_date and only selects attachments after that date
		qc.addOrCondition('table_sys_id', 'IN', items).addCondition('sys_created_on','>',parent.u_wip_date);
	}
})(current, parent);
