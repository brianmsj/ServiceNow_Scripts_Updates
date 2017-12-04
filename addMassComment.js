updateRows();

     function updateRows() {
          var count = 0;
          var rec = new GlideRecord('incident');
          rec.addQuery('category', 'Business Applications');
         rec.addQuery('active', 'true');
          rec.addQuery('opened_at', 'CONTAINS', '2016-08-05 ');
          rec.query();
          while(rec.next()){
               count = count +1;
               rec.comments = "test test test";
               rec.update();
            }
     gs.log(count + 'records have been updated');
}
