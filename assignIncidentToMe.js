/*==================================================================
Name:  Assign Incident to Me
Action name: sysverb_assign_incident (Important that this has an action name beginning with sysverb_)
Show Insert: True
Show Update: True
List Banner Button: True
Description:  UI Action Button 'Assign Incident to Me' in the list view of Incidents.  Assigns Incident by age //and priority where the user is a member of the assignment group on the ticket.
==================================================================*/


var redirect = '/incident.do?sys_id=';
var thisUser = gs.getUserID();
var grp = new GlideRecord('sys_user_grmember');
	grp.addQuery('user', thisUser);
	grp.query();  

var grpList = [];
	while(grp.next()){
		grpList.push(grp.getValue('group'));
}

	var inc =  GlideRecord('incident');
	inc.addQuery('active',true);
	inc.addQuery('assigned_to','');
    inc.addQuery('assignment_group','IN', grpList);
	inc.orderBy('priority');
	inc.orderBy('sys_created_on');
	inc.setLimit(1);
	inc.query();

  if (inc.next())
  {
	inc.assigned_to = thisUser;
	inc.update();
	gs.addInfoMessage("The Incident " + inc.getValue("number") + " has been assigned to you.");
	action.setRedirectURL(redirect+inc.sys_id);  //Redirects user to Incident
  }
