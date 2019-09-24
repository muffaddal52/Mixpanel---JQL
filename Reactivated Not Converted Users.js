//Number of users non converted users that reactivated and then purchased
function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
var one_month = 2*30*24*60*60*1000;

function main() {
  // get events from january
  return Events({
    from_date: "2019-01-01",
    to_date: "2019-08-30",
    event_selectors: [{event: "App_BrandDetailViewed"},{event:"App_HomeViewed"},{event:"App_DealAvailed"}]
  })
  .groupByUser(function(count, events) {
    count =  0;
    for (var i = 1; i < events.length - 2; i++) {
      var count = 0;
      if(events[i].name=="App_DealAvailed"){count = 1; break;}
      var j = i+1;
      var time_difference = events[j].time - events[i].time;
      if (time_difference >= one_month) {
        count = 2;
        //check if this signup user has availed deal again or not.
           for(var k = j+1; k < events.length - 1; k++) {
              if(events[k].name=="App_DealAvailed"){count = 3; break;}
           }   
        return (count);
      }     
    }
    return count;
  })
// .filter(function(item){if(item.value==2) return item})
  .groupBy(['value'],mixpanel.reducer.count())
  .map(function(item){
    if(item.key[0]==1)
    {
    return {
      'userType':'deal availed users',
      'userCount':item.value
    }
    }
    else if(item.key[0]==2)
    {
    return {
      'userType':'reactivated users who did not deal availed',
      'userCount':item.value
    }
    }
      else if(item.key[0]==3)
    {
    return {
      'userType':'reactivated users who deal availed',
      'userCount':item.value
    }
    }
  })  

}
