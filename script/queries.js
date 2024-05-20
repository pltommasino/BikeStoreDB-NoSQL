// Select the database to use.
use('BikeStoreDB');


/* 
-----------------------------------
#             QUERY 1             #
#   The 3 most expensive orders   #
-----------------------------------
______________________________________________________________________________________________________________________________
This aggregation pipeline calculates the total cost for each order, sums the costs, and then retrieves the top 3 orders based 
on their total cost in descending order.
*/

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


db.getCollection('Order').aggregate([
  //JOIN: with Order_items
  {
    $lookup: {
      from: 'Order_items',
      localField: 'order_id',
      foreignField: 'order_id',
      as: 'Order_ID'
    }
  },
  {
    $unwind: {
      path: '$Order_ID',
      preserveNullAndEmptyArrays: false
    }
  },
  //JOIN: with Customers
  {
    $lookup: {
      from: 'Customers',
      localField: 'customer_id',
      foreignField: 'customer_id',
      as: 'Customer_ID'
    }
  },
  {
    $unwind: {
      path: '$Customer_ID',
      preserveNullAndEmptyArrays: false
    }
  },
  //JOIN: with Stores
  {
    $lookup: {
      from: 'Stores',
      localField: 'store_id',
      foreignField: 'store_id',
      as: 'Store_ID'
    }
  },
  {
    $unwind: {
      path: '$Store_ID',
      preserveNullAndEmptyArrays: false
    }
  },
  {}
])