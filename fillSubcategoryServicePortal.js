function onChange(control, oldValue, newValue, isLoading) {
  //remove all items from subcat drop down to start
  // Used the g_form.clearOptions() function instead of g_form.removeOption() function
  g_form.clearOptions('subcategory');


  //build a new list of dependent options
  var gp = new GlideRecord('sys_choice');
  gp.addQuery('dependent_value', newValue);
  gp.addQuery('element', 'subcategory');
  gp.query(function(gp) {
  while(gp.next())
  g_form.addOption('subcategory', gp.value, gp.label);
  });


}
