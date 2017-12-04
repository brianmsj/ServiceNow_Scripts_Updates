(function() {
  /* populate the 'data' object */
  /* e.g., data.table = $sp.getValue('table'); */
	data.problems = []; //data set array
	data.selprb = []; //data set array
	//data.selChkInc = [];
//======================================================================
	var grP = new GlideRecord('problem');
	grP.addEncodedQuery('active=true^state!=7^u_task_category_treeISNOTEMPTY');
	grP.query();
	grP.orderByDesc('number');
	while(grP.next()){
		var prb = {}; //element variable.
		prb.number = grP.getDisplayValue('number');
		prb.short_description = grP.getDisplayValue('short_description');
		prb.description = grP.getDisplayValue('description');
		prb.workaround = grP.getDisplayValue('workaround');
		prb.category = grP.getDisplayValue('u_task_category_tree.u_category_desc_display');
		prb.categoryID = grP.getDisplayValue('u_task_category_tree');
		prb.sys_id = grP.getDisplayValue('sys_id');
		data.problems.push(prb);
	}
//======================================================================
// "Affects Me Too" createIncident action -- button clicked
//======================================================================
if (input.action == "createIncident"){
//*** Get global var from client script using "input" as shown below ***
var strProbID = input.sysid; //use input and the control variable to pass HTML back to the server
var strProbNo = input.prbNo; //would not work when added directly to addQuery('xxx','xxxx)
//=====================================================================
//*** CHECK IF END USER ALREADY HAS AN INCIDENT	***********************
var grChkInc1 = new GlideRecord ('incident');
grChkInc1.addEncodedQuery('problem_id='+strProbID+'^caller_id='+gs.getUserID());
grChkInc1.query();
if (grChkInc1.next()){
	var selChkInc1 = {};
	selChkInc1.number = grChkInc1.number;
	//data.selChkInc.push(selChkInc1);
	gs.addErrorMessage ('Incident '+selChkInc1.number+' has already been submitted for Problem '+strProbNo+' on your behalf.');
	return;
}
//*********************************************************************
//ALL CODE BELOW SHOULD RUN IF END USER DOES NOT ALREADY HAVE A RELATED INCIDENT
//*********************************************************************
//*** Get the "Affects Me Too" Problem Record using the input vaiable for sys_id ***
var grPRB = new GlideRecord('problem');
grPRB.addQuery('sys_id',strProbID);
grPRB.query();
if (grPRB.next()){
	var selprb1 = {}; //element variable is required to extract gr values
	selprb1.categoryID = grPRB.u_task_category_tree;
	data.selprb.push(selprb1);
//**********************************************************************
//**** Create an Incident for the end user **//
var grI = new GlideRecord('incident');
grI.initialize();
grI.problem_id = input.sysid;
grI.u_task_category_tree = selprb1.categoryID; //same category as problem selected
grI.caller_id = gs.getUserID();
//grI.u_on_behalf_of = gs.getUserID();
grI.contact_type = 'self-service';
grI.impact = 2;
grI.urgency = 2;
grI.short_description = grPRB.short_description;
grI.description = grPRB.description;
//grI.u_work_performed_duration = '0 00:01:00';//static duration set to 1 minute
grI.assignment_group = 'xxxxxxxxxxxxxxxxxxxxx'; //sys_id of assignment group
var strIncSysID  = grI.insert();
var grGetInc = new GlideRecord ('incident');
grGetInc.addEncodedQuery('sys_id='+strIncSysID);
grGetInc.query();
if (grGetInc.next()){
	var selChkInc2 = {};
	selChkInc2.number = grGetInc.number;
	//data.selChkInc.push(selChkInc2);
	gs.addInfoMessage ('Incident '+selChkInc2.number+' has been submitted for Problem '+strProbNo);
	return;
}
}
}
})()function($scope,spUtil) {
  /* widget controller */
  var c = this;
	var sysid = ''; //variable can be called from the server via "input".
	var prbNo = ''; //variable can be called from the server via "input".
	//record watch dynamic updates
	spUtil.recordWatch($scope, "problem", "", function(name,data){
		spUtil.update($scope);
	});

	$scope.viewMore = 'No';
	$scope.vmLabel = 'View More Details';
	$scope.seeMore = function(value){
		if (value == 'Yes'){
			$scope.viewMore = 'No';
			$scope.vmLabel = 'View More Details';
		} else {
			$scope.viewMore = 'Yes';
			$scope.vmLabel = 'View Less Detail';
		}
	}

	$scope.sortOrder = 'number';
	$scope.chgSort = function(field){
		if ($scope.sortOrder == field){
			$scope.sortReverse = !$scope.sortReverse;
		} else {
			$scope.sortOrder = field;
		}
	}
	/*
	$scope.prbInc = function(instance){
			$scope.curRec= angular.copy(instance);
	}
	*/
	$scope.createInc = function(instance){
		//copy of data set array from server script
		$scope.thisRec= angular.copy(instance);

		//set global vars using c.data for server side processing
			c.data.sysid = $scope.thisRec.sys_id;
			c.data.prbNo = $scope.thisRec.number;

			c.data.action = "createIncident";
			c.server.update().then(function(){
			c.data.action = undefined;
			c.data.message='';
		});
//	  alert($scope.thisRec.sys_id);
	}
}

<div class ="panel panel-default">
  <div class = "panel-heading">
		Known Problems &nbsp;&nbsp;&nbsp;
    <button ng-if="viewMore == 'No'" ng-click="seeMore(viewMore)">View More Detail</button>
    <button ng-if="viewMore == 'Yes'" ng-click="seeMore(viewMore)">View Less Detail</button>
  </div>
  <table>
    <tr ng-repeat="prb in data.problems | orderBy:sortOrder:sortReverse | filter:SearchText">
			<td><button ng-click="createInc(prb)">Affects Me Too</button></td>
      <td ng-if="viewMore == 'No'">{{prb.short_description}}</td>
      <td ng-if="viewMore == 'Yes'">{{prb.description}}</td>
    </tr>
  </table>
</div>
