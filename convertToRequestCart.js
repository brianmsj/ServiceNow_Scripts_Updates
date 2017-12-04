//Update saves incident
current.update();


var cartId = GlideGuid.generate(null);
var cart = new Cart(cartId);
//Replace the Sys_id with Syd_id of your catalog item.
var item = cart.addItem('17c590e9047531006802a6e8a2359514');
//Set catalog item variables
cart.setVariable(item, 'opened_for', current.caller_id);
cart.setVariable(item, 'location', current.location);
cart.setVariable(item, 'category', current.category);
cart.setVariable(item, 'description', current.description);
cart.setVariable(item, 'short_description', current.short_description);
var rc = cart.placeOrder();


//Update the Change Request fields
var req = new GlideRecord('sc_request');
req.query("sys_id",rc.sys_id);
if (req.next()) {
	req.setValue('parent', current.sys_id);
	req.setValue('requested_for', current.caller_id);
	req.setValue('opened_by', current.caller_id);
	req.setValue('assignment_group', current.assignment_group);
	req.setValue('assigned_to', current.assigned_to);
	req.update();
}
//Update the requested item fields
// var ritm = new GlideRecord('sc_req_item');
// ritm.query('request',rc.sys_id);
// while (ritm.next()) {
// 	ritm.setValue('opened_by', current.caller_id);
// 	ritm.setValue('configuration_item', current.cmdb_ci);
// 	ritm.update();
// }

//Set redirect action and info messages
var url = "sc_request.do?sys_id=" + rc.sys_id;
action.setRedirectURL(current);
gs.addInfoMessage("Request Created: " + "<a href = "+url+">"+ rc.number +"</a>");
gs.addInfoMessage('Parent incident set to: '+current.number+ ' for Record ' + rc.number);
