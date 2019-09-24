//list of power users that left on the day when they last deal availed.

function monthDiff(dateFrom, dateTo) {
 return dateTo.getMonth() - dateFrom.getMonth() + 
   (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}
// last seen and deal availed of chune power users
function main() {
	return join(Events({
        from_date: "2019-01-01",
        to_date: "2019-06-30"
    }),
    People(),
    { type:"inner" }
    ).filter(function(tuple){ 
       return  monthDiff(new Date(tuple.user.last_seen),new Date())>0 && tuple.user.properties.DealAvailed>1 && tuple.event.name == 'App_DealAvailed'
      
    })
    .groupBy(['distinct_id',function(tuple){return new Date(tuple.user.last_seen).toISOString().split("T")[0]},
    function(tuple){return new Date(tuple.event.time).toISOString().split("T")[0]}
    ],
    mixpanel.reducer.count(),
  );
}
