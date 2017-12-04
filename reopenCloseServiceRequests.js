/*
Reopen/Close Service Catalog Requests States/Stages without firing workflows or business rules
======================================================================================

Request States
=====================
requested - Pending Approval
in_process - Approved (Verify the Label is Approved)
closed_complete - Closed Complete
closed_incomplete	- Closed Incomplete
closed_cancelled - Closed Cancelled

states(task)
=====================
-5 - Pending
1 - Open
2 - Work in Progress
3 - Closed Complete
4 - Closed Incomplete
5 - Closed Skipped

Stage
=====================
requested - Requested
approval - Approval
fulfillment - Fulfillment
delivery - Delivery
closed_complete - Closed Complete
closed_incomplete - Closed Incomplete

*/
var gr = new GlideRecord('sc_request');
gr.addQuery('number','REQ0010865');
gr.query();
if(gr.next()){
	gs.print("Request State: "+gr.request_state.getDisplayValue()+": "+gr.request_state);
	gs.print("State: "+gr.state.getDisplayValue()+": "+gr.state);
	gs.print("Stage: "+gr.stage.getDisplayValue()+": "+gr.stage);
}

//Set the Request to Approve
var gr = new GlideRecord('sc_request');
gr.addQuery('number','REQ0010865');
gr.query();
if(gr.next()){
	gr.request_state ='in_process'; //Approved
	gr.state = '2'; //Work in Progress
	gr.stage = 'fulfillment'; //Fulfillment
	gr.setWorkflow(false); //no business rules fired
	gr.autoSysFields(false); //no sys update fields updated
	gr.update();
	gs.print("Request State: "+gr.request_state.getDisplayValue()+": "+gr.request_state);
	gs.print("State: "+gr.state.getDisplayValue()+": "+gr.state);
	gs.print("Stage: "+gr.stage.getDisplayValue()+": "+gr.stage);
}

//Set the Request to Close Complete
var gr = new GlideRecord('sc_request');
gr.addQuery('number','REQ0010865');
gr.query();
if(gr.next()){
	gr.request_state = 'closed_complete'; //Closed Complete
	gr.state = '3'; //Closed Complete
	gr.stage = 'closed_complete' //Closed Complete
	gr.setWorkflow(false); //no business rules fired
	gr.autoSysFields(false); //no sys update fields updated
	gr.update();
	gs.print("Request State: "+gr.request_state.getDisplayValue()+": "+gr.request_state);
	gs.print("State: "+gr.state.getDisplayValue()+": "+gr.state);
	gs.print("Stage: "+gr.stage.getDisplayValue()+": "+gr.stage);
}
