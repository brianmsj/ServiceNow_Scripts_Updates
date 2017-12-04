gr = new GlideRecord('sys_user');
// only records created within the last 7 days
// ** Define as neeeded or comment out for all records **
gr.addQuery('sys_created_on', '>', gs.daysAgoStart(7));
gr.query();
while (gr.next()){
	gr.user_password.setDisplayValue('password goes here');//Set default passsowrd
	gr.password_needs_reset = true; // force user to reset at next login
	gr.update();
}
