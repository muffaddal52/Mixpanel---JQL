  //Get list of products/brand and there SKU that were available on the website but had no conversion in last 5 last days.
  var mydate = new Date();
   var weeks ={
    previousWeekStart :  new Date(mydate - (21*24*60*60*1000))
  }
  
 function main(){
   return Events({
     from_date: "2019-07-31" ,
     to_date:"2019-08-21",
     event_selectors:[{event:"App_BrandDetailViewed"},{event: "App_DealAvailed"}]
     
   })
  .groupBy(["name","properties.brandName", 
  function(event){
    if(new Date(event.time)<new Date(new Date("Thu Aug 15 2019 00:00:23 GMT+0500 (PKT)") - (6*24*60*60*1000))){
      return("period 2")
    }
    else{ 
      return ("period 1")
    }
   },
  (event)=>{
    if(event.properties.dealId===null || event.properties.dealId===undefined) {return undefined}
    return ( [...new Set(event.properties.dealId)].slice(0,6));
  },
  ], 
  mixpanel.reducer.count())
    .map(function(item){
       return{
        "event":item.key[0],
        "brandName":item.key[1],
        "period":item.key[2],
        "deal id1":item.key[3],
        "deal id2":item.key[4],
        "deal id3":item.key[5],
        "deal id4":item.key[6],  
        "count":item.value
      };
    });
 }
