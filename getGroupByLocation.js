var HM_Generic_01 = Class.create();
HM_Generic_01.prototype = {
	initialize: function() {
	},
	//(new HM_Generic_01().getFacAssignGrp(usr.location) != '')
	//Returns a coverage area group or null if the location,
	//Parent Location or Grand Parent Location are not set up as
	//a "location Covered" in the groups table. Assignment groups
	//are filtered by Group type, in this example for "facilities".
	getFacAssignGrp: function(strLocID){
		//Set variables for parent and grandparent location (space, building, campus)
		var strParLocID = '';
		var strGrParLocID = '';
		//Get the Location Parent ID
		var locp = new GlideRecord ('cmn_location');
		locp.addQuery('sys_id',strLocID);
		locp.query();
		if (locp.next()){
			strParLocID = locp.parent;
		}
		//Get the Location Grand Parent ID
		var locg = new GlideRecord ('cmn_location');
		locg.addQuery('sys_id',strParLocID);
		locg.query();
		if (locg.next()){
			strGrParLocID = locg.parent;
		}
		// Set the assignment group based on loaction coverage
		if (strLocID != '') {
			var assgrp = new GlideRecord ('sys_group_covers_location');
			//Check specific UserLocation
			assgrp.addEncodedQuery('location='+strLocID+'^group.typeLIKE3b50c21f370311009a80a0ffbe41f1b3');
			assgrp.query();
			if (assgrp.next()){
				return assgrp.group;
			}
		}
		// Set the assignment group based on parent loaction coverage
		if (strParLocID != '') {
			//Check Parent Location of user
			var assgrpp = new GlideRecord ('sys_group_covers_location');
			assgrpp.addEncodedQuery('location='+strParLocID+'^group.typeLIKE3b50c21f370311009a80a0ffbe41f1b3');
			assgrpp.query();
			if (assgrpp.next()){
				return assgrpp.group;
			}
		}
		// Set the assignment group based on grand parent loaction coverage
		if (strGrParLocID != '') {
			//Check Parent Location of user
			var assgrpg = new GlideRecord ('sys_group_covers_location');
			assgrpg.addEncodedQuery('location='+strGrParLocID+'^group.typeLIKE3b50c21f370311009a80a0ffbe41f1b3');
			assgrpg.query();
			if (assgrpg.next()){
				return assgrpg.group;
			}
		}
	},
	type: 'HM_Generic_01'
};
