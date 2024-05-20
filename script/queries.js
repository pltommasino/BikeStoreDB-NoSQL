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
  //PROJECT: allow us to select the column
  {
    $project: { 
      order_id: 1, 
      totalcost: 
      { $round: [ { $subtract: [ {$multiply: ['$list_price', '$quantity']}, {$multiply: [{$multiply: ['$list_price', '$quantity']}, '$discount']} ]} , 2] }
    }
  },
  //GROUP: by 'order_id' and sum their 'totalcost'
  {
    $group: {
      _id: '$order_id',
      totalcost: { $sum: '$totalcost' }
    }
  },
  //SORT: in descendigly order by 'totalcost'
  {
    $sort: {
      totalcost: -1
    }
  },
  //LIMIT: limit to the top 3 result
  {
    $limit: 3
  }
])


/* 
-------------------------------------------------------------------
#                             QUERY 3                             #
#   Name of the 3 most featured (present) brand in the products   #
-------------------------------------------------------------------
______________________________________________________________________________________________________________________________
This aggregation query outputs the brand_id, brand_name, and count_brand of the 3 most featured brands in the products collection.
*/

db.getCollection('Products').aggregate([
  //GROUP: Group by Brand_ID and count the number of products per brand
  {
    $group: {
      _id: '$brand_id',
      count_brand: { $sum: 1 }
    }
  }
  ,
  //SORT: Order by Count_Brand in descending order
  {
    $sort: {
      count_brand: -1
    }
  },
  //LIMIT: Limit to the top 3 brands
  {
    $limit: 3
  },
  //LOOKUP: Join with the brands collection to get brand details
  {
    $lookup: {
      from: 'Brands',
      localField: '_id',
      foreignField: 'brand_id',
      as: 'brand_details'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element. 
  {
    $unwind: '$brand_details'
  },
  //PROJECT: allow us to select the column
  {
    $project: {
      _id: 0,
      brand_id: '$_id',
      brand_name: '$brand_details.brand_name',
      count_brand: 1
    }
  }
]);