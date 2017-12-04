//SP Check to see if the Scheduled Start Date is within Business Schedule
//Script Include
var CheckScheduleAgainstChgDates = Class.create();
CheckScheduleAgainstChgDates.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    datetimeWithinSchedule: function() {
   var schedname = this.getParameter('sysparm_schedule_name');
   var chg_date_time = this.getParameter('sysparm_dateTime');
   var sched = '';

       var schedRec = new GlideRecord('cmn_schedule');
         schedRec.get('name', schedname);


         if (typeof GlideSchedule != 'undefined') {
         sched = new GlideSchedule(schedRec.sys_id);
     }else {
         sched = new Packages.com.glide.schedules.Schedule(schedRec.sys_id);
     }

        var ChangeDateTime = new GlideDateTime();
        ChangeDateTime.setDisplayValue(chg_date_time);
  var schedDate= sched.isInSchedule(ChangeDateTime);

   return(schedDate);
  },
});



//Catalog Client Script
function onChange(control, oldValue, newValue, isLoading, isTemplate) {
   if (isLoading || newValue == '') {
      return;
   }
    if(oldValue != newValue){
    g_form.hideErrorBox('RAEndUserOutage');
  }

var ga = new GlideAjax('CheckScheduleAgainstChgDates');
   ga.addParam ('sysparm_name','datetimeWithinSchedule');
   ga.addParam ('sysparm_schedule_name','AF Support Business Hours'); //Add Name of Business Schedule
   ga.addParam ('sysparm_dateTime', g_form.getValue('start_date'));
   ga.getXML(CheckScheduleAgainstChgDatesParse);

  function CheckScheduleAgainstChgDatesParse (response) {
    var answer = response.responseXML.documentElement.getAttribute("answer");
 if (answer == 'true') {
           g_form.showErrorBox('RAEndUserOutage', 'The CAB has restricted changes to be implemented during this time frame. Your Change may be denied');
       g_form.setValue('RAEndUserOutage', '');
         }
  }
}
