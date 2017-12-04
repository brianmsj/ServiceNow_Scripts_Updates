//********************************************************************************************************************************
//*** REQUIRED FOR BOTH SCRIPTS.  THIS IS THE MAIN SI CALLED BY BOTH THE SCHEDULED JOB AND THE CLIENT AJAX SCRIPT INCLUDED BELOW ***
//********************************************************************************************************************************

var HM_Duration_Calculator_SI = Class.create();
HM_Duration_Calculator_SI.prototype = {
    initialize: function() {
    },
	//==================================================================
	// Returns the duration between two date strings in seconds. If a valid schedule name is
	// included the calculation sums up only the seconds defined within the schedule (business hours)
	// Use cmn_schedule.list to display a list of schedules.
	// If the first datestring is after the second date string parameter a zero "0" is returned
	// new HM_Duration_Calculator_SI().getDurCalc('now','05-08-2017 08:00:00 PM','8-5 weekdays excluding holidays');
	// new HM_Duration_Calculator_SI().getDurCalc(strDate1,strDate2,strSName);
	//==================================================================
	getDurCalc:function(strDate1,strDate2,strSName){
		var strMessage = ' is not a valid date string';
		if (strDate1 == 'now'){strDate1 = gs.nowDateTime();}
		if (strDate2 == 'now'){strDate2 = gs.nowDateTime();}
		var validate1 = new GlideDateTime(strDate1); //VALIDATE THE PARAMETERS
		var validate2 = new GlideDateTime(strDate2); //VALIDATE THE PARAMETERS
		if ((!validate1.isValid()) || (strDate1 == '')) {
			gs.addErrorMessage('Parameter: '+strDate1+strMessage);
			return;
		}
		if ((!validate2.isValid()) || (strDate2 == '')){
			gs.addErrorMessage('Parameter: '+strDate2+strMessage);
			return;
		}
		//============= DECLARE GLOBAL VARIABLES =========================
		var intDurSec = 0;
		var strDateTime1 = '';
		var strDateTime2 = '';
		strDateTime1 = this._AM_PM_Parser(strDate1);
		strDateTime2 = this._AM_PM_Parser(strDate2);
		var dc = new DurationCalculator();
		if (strSName != ''){
			this._getSchedule(dc,strSName); // works
		}
		dc.setStartDateTime(strDateTime1);
		intDurSec = dc.calcScheduleDuration(strDateTime1,strDateTime2);
		//return intDurSec+' - '+strDateTime1+' - '+strDateTime2;
		return intDurSec;
	},
	//==============================================================
	//**********************LOCAL FUNCTIONS*************************
	//===============================================================
	_getSchedule: function(durationCalculator,strSName) {
		// Out of the box Scheulde Names: '8-5 weekdays excluding holidays'
		// Out of the box Scheulde Names: '8-5 weekdays'
		var scheduleName = strSName;  //cmn_schedule.list
		var grSched = new GlideRecord('cmn_schedule');
		grSched.addQuery('name', scheduleName);
		grSched.query();
		if (!grSched.next()) {
			gs.error("*** Could not find schedule {0}.", scheduleName);
			return;
		}
		return durationCalculator.setSchedule(grSched.getUniqueValue(), "GMT");
	},
	//==========================================================================
	_AM_PM_Parser: function (strDateTime){
	var arrDate = [];
	var arrTime = [];
	if ((strDateTime.indexOf('AM') > 0)  || (strDateTime.indexOf('PM') > 0)){
		arrDate = strDateTime.split(" "); //Split DateTime based on spaces
		arrTime = arrDate[1].split(":"); //Split just the Time based on colon
		if (arrDate[2] == 'AM'){
			if (arrTime[0] == '12'){
				return arrDate[0]+' 00:'+arrTime[1]+':'+arrTime[2];
			} else {
				return arrDate[0]+' '+arrTime[0]+':'+arrTime[1]+':'+arrTime[2];
			}
		}
		if (arrDate[2] == 'PM'){
			//gs.addInfoMessage(arrTime[0]);
			//gs.addInfoMessage(arrTime[0].substr(0,1));
			//gs.addInfoMessage(arrTime[0].substr(1,1));
			if (arrTime[0] == '12'){
				return arrDate[0]+' '+arrTime[0]+':'+arrTime[1]+':'+arrTime[2];
			} else {
				var intHours = 0;
				if (arrTime[0].substr(0,1) == '0') {
					intHours = (parseInt(arrTime[0].substr(1,1)) + 12);
				} else {
					intHours =  (parseInt(arrTime[0]) + 12);
					}
				return arrDate[0]+' '+intHours+':'+arrTime[1]+':'+arrTime[2];
			}
		}
	} else {
		return strDateTime;
	}
},
//========================================================================================
    type: 'HM_Duration_Calculator_SI'
};
(function(){
  //get the incidents that are currently resolved
  var strQuery = 'state=6^resolved_atISNOTEMPTY';
  var gr = new GlideRecord('incident');
  gr.addEncodedQuery(strQuery);
  gr.query();
  while(gr.next()){
    var strBD = '8-5 weekdays excluding holidays'; //Schedule Name goes here (cmn_schedule.list)
    var intDurSec = new HM_Duration_Calculator_SI().getDurCalc(gr.resolved_at.getDisplayValue(),'now',strBD);//Call to HM_Duration_Calculator SI
    if (parseInt(intDurSec) > 97200){  //97200 is 3 business days in seconds based on 8-5 workday (Schedule)
      gr.active = false;
      gr.closed_at = gs.nowDateTime();
      gr.closed_by = gr.resolved_by;
      gr.state = 7;
      gr.update();
      }
  }
})();

(function(){
  //get the incidents that are currently resolved
  var strQuery = 'state=6^resolved_atISNOTEMPTY';
  var gr = new GlideRecord('incident');
  gr.addEncodedQuery(strQuery);
  gr.query();
  while(gr.next()){
    var strBD = '8-5 weekdays excluding holidays'; //Schedule Name goes here (cmn_schedule.list)
    var intDurSec = new HM_Duration_Calculator_SI().getDurCalc(gr.resolved_at.getDisplayValue(),'now',strBD);//Call to HM_Duration_Calculator SI
    if (parseInt(intDurSec) > 97200){  //97200 is 3 business days in seconds based on 8-5 workday (Schedule)
      gr.active = false;
      gr.closed_at = gs.nowDateTime();
      gr.closed_by = gr.resolved_by;
      gr.state = 7;
      gr.update();
      }
  }
})();
var HM_Duration_Calc_Ajax = Class.create();
HM_Duration_Calc_Ajax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	//==================================================================
	// Returns the duration between two date strings in seconds. If a valid schedule name is
	// included the calculation sums up only the seconds defined within the schedule (business hours)
	// Use cmn_schedule.list to display a list of schedules.
	// If the first datestring is after the second date string parameter a zero "0" is returned
	// new HM_Duration_Calculator_SI().getDurCalc('now','05-08-2017 08:00:00 PM','8-5 weekdays excluding holidays');
	// new HM_Duration_Calculator_SI().getDurCalc(strDate1,strDate2,strSName);
	// HM_ClientAjax_DateParser - getDurCalc - sysparm_FromDate, sysparm_ToDate, sysparm_SchedName
	//==================================================================
	getDurCalc: function() {
		var strDate1 = this.getParameter('sysparm_FromDate'); //Date string or now
		var strDate2 = this.getParameter('sysparm_ToDate'); //Date string or now (used to calc durations only)
		var strSName = this.getParameter('sysparm_SchedName'); //Schedule Name goes here (cmn_schedule.list)
		return new HM_Duration_Calculator_SI().getDurCalc(strDate1,strDate2,strSName);// Call to HM_Duration_Calculator SI
	},
	type: 'HM_Duration_Calc_Ajax'
});
