// Select the database to use.
use('BikeStoreDB');


/* 
--------------------------------------------
#             QUERY 2                      #
#   The 3 most expensive orders' details   #
--------------------------------------------
*/

db.getCollection('Order_items').aggregate([
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
  },
  //LOOKUP: Join with the categories collection to get categories details
  {
    $lookup: {
      from: 'Orders',
      localField: '_id',
      foreignField: 'order_id',
      as: 'order_details'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element. 
  {
    $unwind: '$order_details'
  },
      //LOOKUP: Join with the categories collection to get categories details
  {
    $lookup: {
      from: 'Customers',
      localField: 'order_details.customer_id',
      foreignField: 'customer_id',
      as: 'customer_details'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element. 
  {
    $unwind: '$customer_details'
  },
        //LOOKUP: Join with the categories collection to get categories details
  {
    $lookup: {
      from: 'Stores',
      localField: 'order_details.store_id',
      foreignField: 'store_id',
      as: 'store_details'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element. 
  {
    $unwind: '$store_details'
  },
  //SORT: Order by CategoryCount_inProduct in descending order
  {
    $sort: {
      _id: 1
    }
  },
  {
    $project: { 
      _id: 0,
      Customer_ID: '$order_details.customer_id', 
      Customer_FirstName: '$customer_details.first_name',
      Customer_LastName: '$customer_details.last_name',
      Customer_City: '$customer_details.city',
      Customer_ZipCode: '$customer_details.zip_code',
      Customer_State: '$customer_details.state',
      Store_name: '$store_details.store_name',
      Store_State: '$store_details.state',
      Store_ZipCode: '$store_details.zip_code'
    }
  }
])

/* 
--------------------------------------------------
#             QUERY 4                            #
#   Number of bicycles in stock group by Store   #
--------------------------------------------------
*/

db.getCollection('Stores').aggregate([
    //LOOKUP: Join with the stocks collection to get stocks details
  {
    $lookup: {
      from: 'Stocks',
      localField: 'store_id',
      foreignField: 'store_id',
      as: 'store_details'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element. 
  {
    $unwind: '$store_details'
  },
  //GROUP: Group by store_name and store_state and count the number of bibycle per store
  {
    $group: {
      _id: {store_name: '$store_name', state: '$state'},
      Total_Bicycle_In_Stocks: { $sum : '$store_details.quantity'}
    }
  },
  //SORT: Order by Total_Bicycle_In_Stocks in descending order
  {
    $sort: {
      Total_Bicycle_In_Stocks: -1
    }
  },
  //PROJECT: allow us to select the column
  {
    $project: {
      _id: 0,
      store_name: '$_id.store_name',
      state: '$_id.state',
      Total_Bicycle_In_Stocks: '$Total_Bicycle_In_Stocks'
    }
  }
])

/* 
--------------------------------------------------
#             QUERY 8                            #
#   The most featured category in the products   #
--------------------------------------------------
*/

db.getCollection('Products').aggregate([
    //LOOKUP: Join with the categories collection to get categories details
  {
    $lookup: {
      from: 'Categories',
      localField: 'category_id',
      foreignField: 'category_id',
      as: 'category_details'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element. 
  {
    $unwind: '$category_details'
  },
  //MATCH: Selects only the documents in which category_details is not empty
  {
    $match: {
        "category_details": {$ne: []}
    }
  },
  //GROUP: Group by category_id and category_name and count the number of occurrance per category
  {
    $group: {
      _id: {category_id: '$category_id', category_name: '$category_details.category_name'},
      CategoryCount_inProduct: { $count: {}}
    }
  },
  //SORT: Order by CategoryCount_inProduct in descending order
  {
    $sort: {
      CategoryCount_inProduct: -1
    }
  },
  //PROJECT: allow us to select the column
  {
    $project: {
      _id: 0,
      category_id: '$_id.category_id',
      category_name: '$_id.category_name',
      CategoryCount_inProduct: '$CategoryCount_inProduct'
    }
  },
  //LIMIT: limit to the top 3 result
  {
      $limit: 3
  }
])

/* 
------------------------------------------------------------------------
#             QUERY 10                                                 #
#   Number of not available products in the Mountain (bike) category   #
------------------------------------------------------------------------
*/

db.getCollection('Stocks').aggregate([
    //LOOKUP: Join with the categories collection to get categories details
  {
    $lookup: {
      from: 'Products',
      localField: 'product_id',
      foreignField: 'product_id',
      as: 'product_details'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element. 
  {
    $unwind: '$product_details'
  },
  //LOOKUP: Join with the categories collection to get categories details
  {
    $lookup: {
      from: 'Categories',
      localField: 'product_details.category_id',
      foreignField: 'category_id',
      as: 'category_details'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element. 
  {
    $unwind: '$category_details'
  },
  //MATCH: Selects only the documents in which quantity is equal to 0
  {
    $match: {
        'quantity': { $eq: 0}
          
    }
  },
  //GROUP: Group by category_id and category_name and count the number of occurrance per category
  {
    $group: {
      _id: { category_name: '$category_details.category_name'},
      NumberOfNotAvailableProducts: { $count: {}}
    }
  },
  //MATCH: Selects only the documents in which category_details is not empty
  {
    $match: {
        "_id.category_name": {$regex: /Mountain/}
    }
  },
    //PROJECT: allow us to select the column
  {
    $project: {
      _id: 0,
      category_name: '$_id.category_name',
      NumberOfNotAvailableProducts: '$NumberOfNotAvailableProducts'
    }
  }
])

