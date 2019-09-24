//Get list of power users that were inactive for more than one month
function monthDiff(dateFrom, dateTo) {
 return dateTo.getMonth() - dateFrom.getMonth() + 
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
function weekk( d ) { 
  // Create a copy of this date object  
  var target  = new Date(d.valueOf());
  // ISO week date weeks start on monday  
  // so correct the day number  
  var dayNr   = (d.getDay() + 6) % 7; 
  // Set the target to the thursday of this week so the  
  // target date is in the right year  
  target.setDate(target.getDate() - dayNr + 3);  
	
	// ISO 8601 states that week 1 is the week  
  // with january 4th in it  
  var jan4    = new Date(target.getFullYear(), 0, 4);  

  // Number of days between target date and january 4th  
  var dayDiff = (target - jan4) / 86400000;    

  // Calculate week number: Week 1 (january 4th) plus the    
  // number of weeks between target date and january 4th    
  var weekNr = 1 + Math.ceil(dayDiff / 7);    

  return weekNr;    

};
function main() {
	return join(Events({
        from_date: "2018-07-01",
        to_date: "2019-06-30"
    }),
    People(),
    { type:"inner" }
    ).filter(function(tuple){ 
       return  monthDiff(new Date(tuple.user.last_seen),new Date())>0 && tuple.user.properties.DealAvailed>1 && tuple.event.name == 'App_DealAvailed'
      
    })
    .groupBy([
      'distinct_id',
        function(tuple){return new Date(tuple.event.time).getFullYear() },
        function(tuple){return new Date(tuple.event.time).getMonth() },
        function(tuple){return monthNames[new Date(tuple.event.time).getMonth()]},
         function(tuple){
          var now = new Date();
          var onejan = new Date(tuple.event.time);
          //var week = Math.ceil( (((now - onejan) / 86400000) + onejan.getDay() + 1) / 7 )
          return (weekk(onejan)); }
          ],mixpanel.reducer.count(),
      
      );
}
