//to understand the characteristics of users that leave the app within two days of signup.
function monthDiff(dateFrom, dateTo) {
 return dateTo.getMonth() - dateFrom.getMonth() + 
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}
function dayDiff(dateFrom,dateTo){
  return parseInt((dateTo - dateFrom) / (1000 * 60 * 60 * 24), 10);
}
function main() {
  return join(Events({
        from_date: "2019-01-01",
        to_date: "2019-07-30",
    event_selectors: [{event: "App_SegmentDetailViewed"},{event: "App_BrandDetailViewed"},{event: "App_Searched"},{event: "App_PushClicked"},{event: "App_DeeplinkReceive"},{event: "App_DealAvailed"},{event: "App_HomeViewed"},{event: "App_DealShare"},{event: "App_CallUsNow"}]
    }),
    People(),
    { type:"inner" }
    ).filter(function(tuple){ 
       return   monthDiff(new Date(tuple.user.last_seen),new Date())>2 && dayDiff(new Date(tuple.user.properties.AccountCreatedOn),new Date(tuple.user.last_seen))<2 && (new Date(tuple.user.properties.AccountCreatedOn)<new Date('08/01/2019') && new Date(tuple.user.properties.AccountCreatedOn)>new Date('12/31/2018') )
    })
    //these are properties for which I wanted the data and should be updated according to the requirements.
    .groupBy(['event.distinct_id','user.properties.$android_app_version','user.properties.$ios_app_version','user.properties.$ios_device_model','user.properties.Age','user.properties.CurrentDeviceType','user.properties.CurrentAppVersion','user.properties.$android_app_version','user.properties.$android_app_version','user.properties.CityId','user.properties.Gender','user.properties.IsInvited','user.properties.LastViewedBrandName','user.properties.LastViewedBrandName','user.properties.DealAvailed','user.properties.SocialMediaType'],mixpanel.reducer.count())
    .map(function(item){
      return {
          'distinct_id':item.key[0],
          '$android_app_version':item.key[1],
          '$ios_app_version':item.key[2],
          '$ios_device_model':item.key[3],
          'Age':item.key[4],
          'CurrentDeviceType':item.key[5],
          'CurrentAppVersion':item.key[6],
          'CityId':item.key[9],
          'Gender':item.key[10],
          'IsInvited':item.key[11],
          'LastViewedBrandName':item.key[12],
          'DealAvailed':item.key[14],
          'SocialMediaType':item.key[15],
          'eventCount':item.value
      }
      
      
    })
}
