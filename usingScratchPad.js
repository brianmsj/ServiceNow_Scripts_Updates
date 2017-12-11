Scratchpad in service now is a pre-defined object that can easily be used to define a variable in a business rule which can be called from a client script.  This becomes most useful when you want to access "current" field data in a client script or pass date time values.

Create a "Display" business rule and simply setup a scratchpad variable.  The variable name can be the same as a field name or it can be something completely different.  No declaration is necessary since the g_scrtachpad object in the business rule expects the next method to be a variable name

Examples:

Field name as the scratchpad variable name

	g_scratchpad.cmdb_ci = current.cmdb_ci;
	g_scratchpad.u_new_config_item = current.u_new_config_item;
	g_scratchpad.u_infrastructure = current.u_infrastructure;
	g_scratchpad.u_compliance = current.u_compliance;
	g_scratchpad.u_pre_approved = current.u_pre_approved;

Setting variable name "tdate"

  g_scratchpad.tdate = tomorrow.getDisplayValue();
  //scratchpad.tdate = tomorrow.getDisplayValue();
