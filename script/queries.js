// Select the database to use.
use('BikeStoreDB');

// -----------------------------
// QUERY 1
// The 3 most expensive orders
// -----------------------------
db.getCollection('Order_items').aggregate([
  //Project: allow us to select the column
  {
    $project: { 
      order_id: 1, 
      totalcost: 
      { $round: [ { $subtract: [ {$multiply: ['$list_price', '$quantity']}, {$multiply: [{$multiply: ['$list_price', '$quantity']}, '$discount']} ]} , 2] }
    }
  },
  //Group: by 'order_id' and sum their 'totalcost'
  {
    $group: {
      _id: '$order_id',
      totalcost: { $sum: '$totalcost' }
    }
  },
  //Sort: in descendigly order by 'totalcost'
  {
    $sort: {
      totalcost: -1
    }
  },
  //Limit: print the first 3 result
  {
    $limit: 3
  }
])