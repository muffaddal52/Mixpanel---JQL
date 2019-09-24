//Number of users who churned after receiving app notification
function main() {
  return Events({
    from_date: '2019-01-01',
    to_date:   '2019-08-26'
  })
  .filter(function(event){if(event.properties.$os==='Android')return event})
  .filter(function(event){if(event.name !=='$campaign_delivery' && event.name !=='$message_suppressed' && event.name!=="$ae_session")return event})
  .groupByUser(function(count,events){
    count = 0, date='';
    for(var i = events.length-1,  counter=0; counter<4; counter++){
      if(events[i].name==='App_PushReceivedAndroid'){
        count++;
      
      }
    }
    return [count, events[events.length-1].time,  new Date(events[events.length-1].time).toISOString()]
  })
  .filter(function(user) {
    return user.value[0] == 0 & (new Date()- new Date(user.value[1]) ) > 45*24*60*60*1000;
  })
  .reduce(mixpanel.reducer.count())
  
}
