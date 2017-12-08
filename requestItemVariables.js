(function executeRule(current, previous /*null when async*/) {
	//Declare some global variable
	var getVarString = '';
	var strValue = '';
	var strAssGrp = '';
	// Get the variable information for this requested item.
	// 1. Query the m2m table for the requested item
	var sc_item_m2m = new GlideRecord('sc_item_option_mtom');
	sc_item_m2m.addQuery('request_item',current.sys_id);
	sc_item_m2m.query();
	while (sc_item_m2m.next()){
		// Once varibles for the item are discovered iterate through each record.
		// 2. One at a time grab each variable record
		var sc_item_op = new GlideRecord('sc_item_option');
		sc_item_op.addQuery('sys_id',sc_item_m2m.sc_item_option);
		sc_item_op.query();
		if (sc_item_op.next()) {
			//Some variable values are actully sys_ids they have a type = Reference
			//3. Identify these table references and grab the Name field data (typical for Location and User)
			if (sc_item_op.item_option_new.type.getDisplayValue() == 'Reference'){
				var getTabData= new GlideRecord(sc_item_op.item_option_new.reference);
				getTabData.addQuery('sys_id',sc_item_op.value);
				getTabData.query();
				if (getTabData.next()){
					strValue = getTabData.name; //***** assumes there is a name field ******
				}
				//Facilities wants the request assigned based on location
				//4. If the reference is a location, get the group sys_id for assignment
				if (sc_item_op.item_option_new.reference == 'cmn_location') {
					gs.addInfoMessage(sc_item_op.item_option_new.reference);
					var assgrp = new GlideRecord ('sys_group_covers_location');
					assgrp.addEncodedQuery('location='+sc_item_op.value+'^group.typeLIKE3b50c21f370311009a80a0ffbe41f1b3');// Facilitiy Types ONLY
					assgrp.query();
					if (assgrp.next()){
						strAssGrp = assgrp.group;
					}
				}
			}
			else {
				//5. If the variable is not a sys_id just get the value in the variable
				strValue = sc_item_op.value;
			}
			// 6. Build a string that can be used to populate the request description
			if (getVarString != ''){
				getVarString = getVarString + sc_item_op.item_option_new.question_text+String.fromCharCode(13)+strValue+String.fromCharCode(13)+String.fromCharCode(13);
			} else {
				getVarString = sc_item_op.item_option_new.question_text+String.fromCharCode(13)+strValue+String.fromCharCode(13)+String.fromCharCode(13);
			}
		}
	}
	// 7. Create an onboarding facilities Request
	var fcr = new GlideRecord ('facilities_request');
	fcr.initialize();
	fcr.caller = gs.getUserID();
	fcr.assignment_group = strAssGrp;
	fcr.short_description = 'Onboarding Request Item No: '+current.number;
	fcr.initiated_from = current.request;
	fcr.description = getVarString;
	var fcr_id = fcr.insert();
})(current, previous);
