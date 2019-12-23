//code to get the check size and other information on deal avail event.
var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function main() {
  return join(Events({
        from_date: "2019-04-01",
        to_date: "2019-09-30",
        event_selectors:[{event:"App_DealAvailed"}]  //purchased event
    
    }),
    People(),
    { type:"inner" }
    )
    //filter to only get users whose accounts were created within the given data range.
    .filter(function(tuple){
      return new Date( tuple.user.properties.AccountCreatedOn ) > new Date("2019-04-01") && new Date( tuple.user.properties.AccountCreatedOn ) <= new Date("2019-09-30") 
    })
    
    //selecting requred properties.
   .groupBy([
     "user.properties.userId","event.properties.savedAmount","event.properties.spentAmount","event.properties.billedAmount","event.properties.brandName","event.properties.cityId","event.properties.Wifi",
     function(tuple){return (new Date(tuple.event.time).toISOString().split('T')[0])}
   ], mixpanel.reducer.count())
  
//maping properties to their corresponding names
  .map(function(item){
    return{
      "userId":item.key[0],
      "savedAmount":item.key[1],
      "spentAmount":item.key[2],
      "billedAmount":item.key[3],
      "brandName":item.key[4],
      "cityId":item.key[5],
      "Wifi":item.key[6],
      "date":item.key[7],
      "count":item.value,
      
    }
  })
}
