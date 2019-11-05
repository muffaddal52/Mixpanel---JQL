function main() {
  return Events({
    from_date: '2019-06-01',
    to_date:   '2019-07-30'
  })
  .filter(function(event){if(event.properties.$os==='Android')return event})
  .filter(function(event){if(event.name !=='$campaign_delivery' && event.name !=='$message_suppressed' && event.name!=="$ae_session")return event})
  .groupByUser(function(count,events){
    count = 0, date='';
    for(var i = events.length-1,  counter=0; counter<3; counter++){
      if(events[i].name==='App_PushReceivedAndroid'){
        count++;
      }
    }
    var isSignup = false;
  for( i = 0; i< events.length-1;i++){ 
     if(events[i].name === 'App_SignUpSuccess' && events[i].properties.type === 'register' ){
       isSignup = true;
       break;
       }
     }
     if(isSignup===true){
       return [count, events[events.length-1].time,  new Date(events[events.length-1].time).toISOString()]
       
     } else{
       return [-1, events[events.length-1].time,  new Date(events[events.length-1].time).toISOString()]
     } 
  })
  .filter(function(item) {
    return  (new Date()- new Date(item.value[1]) ) > 20*24*60*60*1000;
  })
  .groupBy(['value.0'],mixpanel.reducer.count())
  
}

// note 
//-1 indicates users who didn't signup in given period
//0 indicates users who churned was not because of notifications
//3 indicates users who churned because of notifications
