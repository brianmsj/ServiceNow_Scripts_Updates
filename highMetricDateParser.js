//===================================================================================
//HOW TO USE HM DateTime Parser
//===================================================================================
//The Highmetric date parser script include is designed to return any datetime, date, time or duration strings based on UTC or local timezone settings.  There are two script includes that when added to any system allow consultants to pass any valid servicenow datetime strings in client scripts, business rules or UI Actions.  The returned result can be used to display or populate datetime fields, date fields, time fields or duration fields.  The two scripts and examples on how to use them are shown below:

//HM_ClientAjax_DateParser
//HM_Generic_DateParser //

//FROM A CLIENT SCRIPT
	var ajax = new GlideAjax('HM_ClientAjax_DateParser');
	ajax.addParam('sysparm_name','getDateTime');
	ajax.addParam('sysparm_date','Parameter1');
	ajax.addParam('sysparm_date2','Parameter2');
	ajax.addParam('sysparm_calc','Parameter3');
	ajax.addParam('sysparm_value','Parameter4');
	ajax.addParam('sysparm_return','Parameter5');

//FROM A BUSINESS RULE OR UI ACTION:
	new HM_Generic_Date_Parser().getDateTime(Parameter1,Parameter2,Parameter3,Parameter4,Parameter5);
-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//Parameters are passed through the script include functions which determine the result.  NEVER PASS A DATE OBJECT, SIMPLY PASS A DATE OBJECT'S DISPLAY VALUE OR STRING (datefield.getDisplayValue())  in Parameters 1 or 2.  All date strings passed are validated first then converted to date objects automatically in the script include.  Parameter 2 is only used when duration is specified in Parameter 3.  When parameters do not apply for the desired result simply populate them with an empty string, or in the case of Parameter 4 (floating decimal value), a zero as shown in the examples below.  Zero is also used in parameter 4 with all the parameter 3 “add” options to return the current datetime.  Negative / positive values in parameter 4 calculate past or future results from the value specified in parameter 1.

Parameter1:  Valid SN datetime string value or now (see examples below)
        - ALWAYS REQUIRED
        - any valid datetime format
        - Datetime string or enter now  for current datetime


Parameter2:  Valid SN datetime string value or now (see examples below) **
        - ONLY USED WHEN PARAMETER 3 is duration, otherwise use empty string placeholder
        - any valid datetime format
        - Datetime string or enter now  for current datetime

Parameter3: Calculation - What to Do Parameter

    The following parameter values return UTC or local time and require values in parameters 1,4 and 5

    add_days_utc, add_days_local
    add_weeks_utc, add_weeks_local
    add_months_utc, add_months_local
    add_years_utc, add_years_local
    add_hours_utc, add_hours_local
    add_minutes_utc, add_minutes_local
    add_seconds_utc, add_seconds_local

    duration - Requires parameters 1 and 2.  When duration is specified, parameters 4 and 5 are ignored **

Parameter4: Floating Decimal Value - used to calculate datetime, date or time values (** Not applicable for duration in Parameter 3)
        - Specify positive number to add.
        - Specify negative number to subtract.
        - Specifiy zero when used with now in Parameter1 to get current date or time

Parameter5: Return Type parameter
        - datetime – returns a datetime value
        - date – returns a date value
        - time – returns a time value
        -  ** duration is automatic if specified in Parameter 3, (pass an empty string here “” for duration).
-----------------------------------------------------------------------------------------------------------------------------------------------------------------
EXAMPLES:

When returning values from a specified string or from now, specifiy one of the "add" options for paramter3 and zero for parameter 4.  The examples below
assume:
	- the current datetime or now is 11/30/2016 07:30:00 PM
	- the timezone is eastern time (-5 hours from UTC, -4 hours during daylight savings time)
	- the system property for date is MM/dd/yyyy and for time is: hh:mm:ss a

Get current datetime in the users local timezone:
	new HM_Generic_Date_Parser().getDateTime("now","","add_days_local",0,"datetime");
		Returns: 11/30/2016 07:30:00 PM

Get current datetime in UTC (universal time constant):
	new HM_Generic_Date_Parser().getDateTime("now","","add_days_utc",0,"datetime");
		Returns: 11/30/2016 02:30:00 PM

Get yesterdays datetime in the users local timezone
	new HM_Generic_Date_Parser().getDateTime("now","","add_days_local",-1,"datetime");
		Returns: 11/29/2016 07:30:00 PM

Get tomorrows datetime in the users local timezone
	new HM_Generic_Date_Parser().getDateTime("now","","add_days_local",1,"datetime");
		Returns: 12/01/2016 07:30:00 PM

Get local time from a specified date string users local timezone
	new HM_Generic_Date_Parser().getDateTime("2016-11-30 20:30:00","","add_hours_local",0,"time");
		Returns: 08:30:00 PM

Get just the date 3 months from a specified date string in the users local timezone
	new HM_Generic_Date_Parser().getDateTime("11/30/2016 08:30:00 PM","","add_months_local",3,"date");
		Returns: 02/28/2017

Get the duration between today and a datetime string
	new HM_Generic_Date_Parser().getDateTime("now","12/10/2016 08:30:00 PM","duration",0,"");
		Returns: 10 Days 1 hour 0 minutes 0 seconds
// *****  REMINDER:  Be sure to enable checkbox  Client Callable  ****

var HM_ClientAjax_DateParser = Class.create();
HM_ClientAjax_DateParser.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	getDateTime: function() {
		var strDateTime = this.getParameter('sysparm_date'); //Date string or now
		var strDateTime2 = this.getParameter('sysparm_date2'); //Date string or now (used to calc durations only)
		var strCalc = this.getParameter('sysparm_calc'); // add_days_local
		var strValue = this.getParameter('sysparm_value'); // how much to add or subtract
		var strReturn = this.getParameter('sysparm_return'); // DateTime, Date, Time, Duration
		return new HM_Generic_Date_Parser().getDateTime(strDateTime,strDateTime2,strCalc,strValue,strReturn);
	},
	type: 'HM_ClientAjax_DateParser'
});
var HM_Generic_Date_Parser = Class.create();
HM_Generic_Date_Parser.prototype = {
	initialize: function() {
	},
	//new HM_Generic_Date_Parser().getDateTime(now,'','add_days_local',0,'DateTime');
	//new HM_Generic_Date_Parser().getDateTime(strDate,strDate2,strCalc,strValue,strReturn);
	getDateTime: function(strDateTime,strDateTime2,strCalc,strValue,strReturn) {
		var strDate = '';
		var strDate2 = '';
		strCalc = strCalc.toLowerCase();
		strReturn = strReturn.toLowerCase();
		if (strCalc == 'duration') {strReturn = strCalc;}
		//************************************************************************************
		//**** VALDIATE THEN FIX AM PM TIME STRINGS ******************************************
		if (strDateTime != 'now'){
			var validate = new GlideDateTime(strDateTime);
			if ((validate.isValid()) && (strDateTime != '')) {
				//gs.addInfoMessage(this._AM_PM_Parser(strDateTime));
				strDate = this._AM_PM_Parser(strDateTime);
			} else {
				gs.addErrorMessage('The string entered "'+strDateTime +'" IS NOT a valid datetime string.');
				return false;
			}
		}
		if ((strCalc == 'duration') && (strDateTime2 != 'now')){
			var validate2 = new GlideDateTime(strDateTime2);
			if ((validate2.isValid()) && (strDateTime2 != '')) {
				//gs.addInfoMessage(this._AM_PM_Parser(strDateTime2));
				strDate2 = this._AM_PM_Parser(strDateTime2);
			} else {
				gs.addErrorMessage('The string entered "'+strDateTime2 +'" IS NOT a valid datetime string.');
				return false;
			}
		}
		//************************************************************************************
		//**** SET GLOBAL VARIABLES **********************************************************
		var strNow = '';
		var strNow2 = '';
		var intTZ_DST = 0;
		var intTZ_DST2 = 0;
		//var intTZ_DST_strNow = 0;
		//var intTZ_DST_strNow2 = 0;
		var gdt = '';
		var gdt2 = '';
		var getDur = new GlideDuration();
		//************************************************************************************
		//**** CURRENT DATE TIME (offset added back) *****************************************
		if ((strDate == 'now') || (strDate == '') || (strDate == 'today') ||(strDate == 'current')) {
			strNow = new GlideDateTime();
			var intTZ_DST_strNow = parseInt(strNow.getTZOffset());
			strNow.add(intTZ_DST_strNow);
		}
		if ((strDate2 == 'now') || (strDate2 == '') || (strDate2 == 'today') || (strDate2 == 'current')) {
			strNow2 = new GlideDateTime();
			var intTZ_DST_strNow2 = parseInt(strNow2.getTZOffset());
			strNow2.add(intTZ_DST_strNow2);
		}
		//************************************************************************************
		//**** SET THE GLOBAL DATE OBJECTS FOR "now" PARAMETERS ******************************
		if ((strDate != 'now') && (strDate != '') && (strDate != 'today') && (strDate != 'current')) {
			gdt = new GlideDateTime(strDate);
		} else {
			//gs.addInfoMessage (strNow.getDisplayValue());
			gdt = new GlideDateTime(strNow);
		}
		intTZ_DST = parseInt(gdt.getTZOffset()); //Get Timezone Offset

		if ((strDate2 != 'now') && (strDate2 != '') && (strDate2 != 'today') && (strDate2 != 'current')) {
			gdt2 = new GlideDateTime(strDate2);
		} else {
			//gs.addInfoMessage (strNow2.getDisplayValue());
			gdt2 = new GlideDateTime(strNow2);
		}
		intTZ_DST2 = parseInt(gdt2.getTZOffset()); //Get Timezone Offset
		//gs.addInfoMessage(strCalc+' '+strReturn);

		//************************************************************************************
		//***** ERROR HANDLER - DISPLAY DETAILED MESSAGES  **********************************
		if ((strReturn == 'duration') && (strCalc != 'duration')){
			gs.addErrorMessage('Durations can only be returned if the "strCalc" parameter of the script include is set to"duration" and both "strDate" and "strDate2" parameters contain valid dates');
			return '';
		}
		if (strCalc == 'duration'){
			getDur = GlideDateTime.subtract(gdt, gdt2);
		}

		//************************************************************************************
		//***** PERFORM CALCULATIONS AND APPLY TZ FOR LOCAL ONLY  ****************************
		if (strCalc == 'add_days_local'){
			gdt.addDaysLocalTime(strValue);
			gdt.subtract(intTZ_DST);
		}
		if ((strCalc == 'add_days') || (strCalc == 'add_days_utc')){
			gdt.addDaysUTC(strValue);
		}
		if (strCalc == 'add_months_local'){
			gdt.addMonthsLocalTime(strValue);
			gdt.subtract(intTZ_DST);
		}
		if ((strCalc == 'add_weeks') || (strCalc == 'add_weeks_utc')){
			gdt.addWeeksUTC(strValue);
		}
		if (strCalc == 'add_weeks_local'){
			gdt.addWeeksLocalTime(strValue);
			gdt.subtract(intTZ_DST);
		}
		if ((strCalc == 'add_months') || (strCalc == 'add_months_utc')){
			gdt.addMonthsUTC(strValue);
		}
		if (strCalc == 'add_years_local'){
			gdt.addYearsLocalTime(strValue);
			gdt.subtract(intTZ_DST);
		}
		if ((strCalc == 'add_years') || (strCalc == 'add_years_utc')){
			gdt.addYearssUTC(strValue);
		}
		if (strCalc == 'add_seconds_local'){
			gdt.addSeconds(strValue);
			gdt.subtract(intTZ_DST);
		}
		if ((strCalc == 'add_seconds') || (strCalc == 'add_seconds_utc')){
			gdt.addSeconds(strValue);
		}
		if (strCalc == 'add_minutes_local'){
			gdt.addSeconds(strValue * 60);
			gdt.subtract(intTZ_DST);
		}
		if ((strCalc == 'add_minutes') || (strCalc == 'add_minutes_utc')){
			gdt.addSeconds(strValue * 60);
		}
		if (strCalc == 'add_hours_local'){
			gdt.addSeconds(strValue * 3600);
			gdt.subtract(intTZ_DST);
		}
		if ((strCalc == 'add_hours') || (strCalc == 'add_hours_utc')){
			gdt.addSeconds(strValue * 3600);
		}
		//************************************************************************************
		//**** RETURN DATETIME, DATE, TIME or DURATION ***************************************
		if (strReturn == 'datetime'){
			return gdt.getDisplayValue();
		}
		//gs.addInfoMessage(gdt.getDisplayValue().substr(20,2));
		var arrGDT = gdt.getDisplayValue().split(" "); //Split Date Time String
		if (strReturn == 'date'){
			return arrGDT[0];
		}
		if (strReturn == 'time'){
			if ((gdt.getDisplayValue().indexOf('AM') > 0) || (gdt.getDisplayValue().indexOf('PM') > 0)){
				return arrGDT[1]+' '+arrGDT[2];
			} else {
				return arrGDT[1];
			}
		}
		if ((strReturn == 'duration') && (strCalc == 'duration')){
			return getDur;
		}
	},
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
	type: 'HM_Generic_Date_Parser'
};
There are two fundamental issues that create all the confusion and my script include resolves:

1. When SN processes GlideDateTime() the current local date and time is retuned with no consideration for time zone.  When GlideDateTime('11/19/2016 07:30:00 PM') is processed, the timezone offset is automatically applied.  The timezone offset INCLUDES consideration for day light savings time. This discrepancy in my opinion is totally unintuitive, it creates confusion when you need to perform a simple date time calculation, especially when the current datetime needs to be compared to a static date value stored in a field or a string.  One side of the comparison does not compensate for timezone where the other side does, very confusing in my opinion. To compensate for this my script include applies timezone for current or the  “now” parameter I created ensuring that the calculated results make sense.

2. SN converts all formatted time to a 24 hour clock ... this can be validated if you pass an AM/PM string through the glide API then display the “internal” value.  There seems to be a “bug” with this inherent conversion, the AM/PM indicator is simply truncated from the time field.  Anything specified in PM is converted incorrectly to AM causing erroneous results.  In every test a PM time string was simply truncated, so 01:00:00 PM was returned as 01:00:00, 07:30:00 PM was returned as 07:30:00.  To circumvent this “bug” my script include performs this conversion BEFORE passing the string to the GlideDateTime API.

These two issues are at the heart of all the datetime confusion. This has been tested to ensure results are valid for both UTC and local timezones as well as field population.
