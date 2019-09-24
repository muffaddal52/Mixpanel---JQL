//Get the count of converted users that were churned then later reactivated and purchased again
function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
var one_month = 30*24*60*60*1000;

function main() {
  // get events from january
  return Events({
    from_date: "2019-01-01",
    to_date: "2019-07-30",
    event_selectors: [{event: "App_DealAvailed"},{event: "App_SignUpSuccess"},{event:"$ae_session"}]
  })
  .groupByUser(function(count, events) {
    count =  0;
    for (var i = 1; i < events.length - 1; i++) {
      if(events[i].name=="App_DealAvailed"){
        var dealAvailedEvent = events[i];
        count=1;
      
      for(var j = i+1; j < events.length - 1; j++) {
          if(events[j].name=="App_SignUpSuccess"){
            var time_difference = events[j].time - events[i].time
            //check if time difference is greater than 30 days
            if (time_difference >= one_month) {
              count += 1;
              //check if this signup user has availed deal again or not.
                 for(var k = j+1; k < events.length - 1; k++) {
                    if(events[k].name=="App_DealAvailed"){count += 1; break;}
                 }   
              return (count);
            }         
          }
          else if(events[j].name=="$ae_session"){
            //if neighbouring events have app success
              if(events[j+1].name=="App_SignUpSuccess" || events[j-1].name=="App_SignUpSuccess"){
                var time_difference = events[j].time - events[i].time
                //check if time difference is greater than 30 days
                if (time_difference >= one_month) {
                  count += 1;
                 //check if this signup user has availed deal again or not.
                 for(var k = j+1; k < events.length - 1; k++) {
                    if(events[k].name=="App_DealAvailed"){count += 1; break;}
                 } 
                  return (count);
                }         
              }            
            //only count app session if the last deal availed and app session are not on same day.
           else if(!sameDay(new Date(events[j].time),new Date(events[i].time))){
              i;
              break;
              }
            }
      }
    }
    }
    return count;
  })
// .filter(function(item){if(item.value==2) return item})
	.groupBy(['value'],mixpanel.reducer.count())
	.map(function(item){
	  if(item.key[0]==0)
	  {
	  return {
	    'userType':'did not availed deal',
	    'userCount':item.value
	  }
	  }
	  else if(item.key[0]==1)
	  {
	  return {
	    'userType':'other users who deal availed',
	    'userCount':item.value
	  }
	  }
	  else if(item.key[0]==2)
	  {
	  return {
	    'userType':'converted users who reactivate but has not avail deal again',
	    'userCount':item.value
	  }
	  }
	    else if(item.key[0]==3)
	  {
	  return {
	    'userType':'converted users who deal availed again after reactivation',
	    'userCount':item.value
	  }
	  }
	})

}
