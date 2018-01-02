

  var user = new GlideRecord('sys_user');
  user.query();
  while(user.next()) {
    var manager = user.getValue('u_manager_string');
    var userTwo = new GlideRecord('sys_user')
    userTwo.addQuery('u_object_id',manager)
    userTwo.query();
    var name = userTwo.getValue('name')
    user.setValue('manager',name)
    user.update();
  }
  var user = new GlideRecord('sys_user')
  user.query();
  while(user.next()) {

  var manager = user.getValue('u_manager_string');
  gs.print(manager);

  }

  var user = new GlideRecord('sys_user')
user.query();
while(user.next()) {

var manager = user.getValue('u_manager_string');
var userTwo = new GlideRecord('sys_user');
userTwo.addQuery('u_object_id',manager);
userTwo.query();
var name = userTwo.getValue('name');
gs.print(name);

}
