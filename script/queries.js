// Select the database to use.
use('BikeStoreDB');

/* 
______________________________________________________________________________________________________________________________
This space is dedicated to update date columns in collections and to manage null values
*/

//UPDATE 'manager_id' column in 'Staffs' collection
db.Staffs.updateMany(
    { manager_id: 'NULL' },
    { $set: { manager_id: null } }
);

//UPDATE 'phone' column in 'Customers' collection
db.Customers.updateMany(
    { phone: 'NULL' },
    { $set: { phone: null } }
);

//UPDATE 'shipped_date' column in 'Orders' collection
db.Orders.updateMany(
    { shipped_date: 'NULL' },
    { $set: { shipped_date: null } }
);

//UPDATE 'order_date' column in 'Orders' collection
db.Orders.updateMany({}, [
  {
    $set: {
      order_date: {
        $toDate: "$order_date"
      }
    }
  }
]);

//UPDATE 'required_date' column in 'Orders' collection
db.Orders.updateMany({}, [
  {
    $set: {
      required_date: {
        $toDate: "$required_date"
      }
    }
  }
]);

//UPDATE 'shipped_date' column in 'Orders' collection
db.Orders.updateMany({
  shipped_date: {$ne: NaN} }, 
  [
      {
          $set: {
              shipped_date: {
                  $toDate: '$shipped_date'
              }
          }
      }
]);



/* 
______________________________________________________________________________________________________________________________
*/


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
  },
  //PROJECT: allow us to select the column
  {
    $project: { 
      _id: 0,
      order_id: '$_id', 
      totalcost: '$totalcost'
    }
  }
])


/* 
--------------------------------------------
#                 QUERY 2                  #
#   The 3 most expensive orders' details   #
--------------------------------------------
______________________________________________________________________________________________________________________________
This aggregation query outputs informations of customers and stores involved in the 3 most expensive orders.
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
},
//LOOKUP: Join with the orders collection to get orders details
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
    //LOOKUP: Join with the customers collection to get customers details
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
      //LOOKUP: Join with the stores collection to get stores details
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
//SORT: Order by order_id in ascending order
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
      count_brand: '$count_brand'
    }
  }
]);


/* 
--------------------------------------------------
#                    QUERY 4                     #
#   Number of bicycles in stock group by Store   #
--------------------------------------------------
______________________________________________________________________________________________________________________________
This aggregation query outputs store_name, state and Total_Bicycle_In_Stocks, grouped by store.
*/

db.getCollection('Stores').aggregate([
  //LOOKUP: Join with the stocks collection to get stocks details
{
  $lookup: {
    from: 'Stocks',
    localField: 'store_id',
    foreignField: 'store_id',
    as: 'stocks_details'
  }
},
//UNWIND: Deconstructs an array field from the input documents to output a document for each element. 
{
  $unwind: '$stocks_details'
},
//GROUP: Group by store_name and store_state and count the number of bibycle per store
{
  $group: {
    _id: {store_name: '$store_name', state: '$state'},
    Total_Bicycle_In_Stocks: { $sum : '$stocks_details.quantity'}
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
-------------------------------------------------------------------
#                             QUERY 5                             #
#                       Average order price                       #
-------------------------------------------------------------------
______________________________________________________________________________________________________________________________
In the fifth query we wanted to show the average order price among all the orders.
*/

db.getCollection('Order_items').aggregate([
  //PROJECT: allow us to select the column
  {
      $project: { 
          order_id: 1, 
          totalcost: 
          { $subtract: [ {$multiply: ['$list_price', '$quantity']}, {$multiply: [{$multiply: ['$list_price', '$quantity']}, '$discount']} ]}
      }
  },
  //GROUP: by 'order_id' and sum their 'totalcost'
  {
      $group: {
          _id: '$order_id',
          totalcost: { $sum: '$totalcost' }
      }
  },
  //GROUP: group for take the mean of the all 'totalcost'
  {
      $group: {
          _id: null,
          full_order_price_average: {$avg: '$totalcost'}
      }
  },
  //PROJECT: select only the 'full_order_price_average' column, and take only two value after comma ($round)
  {
      $project: {
          _id: 0,
          full_order_price_average: {$round: ['$full_order_price_average', 2]}
      }
  }
])


/* 
-----------------------------------------------------
#                      QUERY 6                      #
#   Number of processing orders, grouped by state   #
-----------------------------------------------------
______________________________________________________________________________________________________________________________
In this query we wanted to show the number of processing orders grouped by customer's State.
*/

db.getCollection('Orders').aggregate([
    //LOOKUP: Join with the customers collection to get customers details
  {
    $lookup: {
      from: 'Customers',
      localField: 'customer_id',
      foreignField: 'customer_id',
      as: 'customer_details'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element. 
  {
    $unwind: '$customer_details'
  },
  //MATCH: Selects only the documents in which order_status is equal to 2 (the number 2 notices a processing order)
  {
    $match: {
        "order_status": {$eq: 2}
    }
  },
  //GROUP: by 'state'
  {
    $group: {
      _id: '$customer_details.state',
      NumberOfProcessingOrders: { $count: {}}
    }
  },
  //SORT: Order by NumberOfProcessingOrders in descending order
  {
    $sort: {
      NumberOfProcessingOrders: -1
    }
  },
  //PROJECT: allow us to select the column
  {
    $project: {
      _id: 0,
      state: '$_id',
      NumberOfProcessingOrders: '$NumberOfProcessingOrders'
    }
  }
])




/* 
-------------------------------------------------------------------
#                             QUERY 7                             #
#                The 3 best-selling products details              #
-------------------------------------------------------------------
______________________________________________________________________________________________________________________________
In this query we want to show the name and quantity of 3 best-selling product.
*/

db.getCollection('Products').aggregate([
  //LOOKUP: join with Order_items
  {
    $lookup: {
      from: 'Order_items',
      localField: 'product_id',
      foreignField: 'product_id',
      as: 'order_details'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element.
  {
    $unwind: '$order_details'
  },
  //LOOKUP: join with Categories
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
  //PROJECT: allow us to select the column
  {
      $project: {
          _id: 0,
          product_id: 1,
          product_name: 1,
          model_year: 1,
          list_price: 1,
          quantity: '$order_details.quantity',
          category_name: '$category_details.category_name'
      }
  },
  //GROUP: group by product and sum the quantity sold ('total_quantitysold')
  {
      $group: {
          _id: {
              product_id: '$product_id',
              product_name: '$product_name',
              category_name: '$category_name',
              model_year: '$model_year',
              list_price: '$list_price'
          },
          total_quantitysold: {$sum: '$quantity'},
      }
  },
  //SORT: in descendigly order by 'total_quantitysold'
  {
      $sort: {
          total_quantitysold: -1
      }
  },
  //LIMIT: limit to the top 3 result
  {
      $limit: 3
  },
  //PROJECT: allow us to select the column
  {
      $project: {
          _id: 0,
          product_id: '$_id.product_id',
          product_name: '$_id.product_name',
          category_name: '$_id.category_name',
          model_year: '$_id.model_year',
          list_price: '$_id.list_price',
          quantity: '$_id.quantity',
          total_quantitysold: '$total_quantitysold'
      }
  }
]);

/* 
--------------------------------------------------
#                    QUERY 8                     #
#   The most featured category in the products   #
--------------------------------------------------
______________________________________________________________________________________________________________________________
This aggregation query outputs category_id, category_name and CategoryCount_inProduct, showing the most featured category in the products.
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
//PROJECT: allow us to select the column
{
  $project: {
    _id: 0,
    category_id: '$_id.category_id',
    category_name: '$_id.category_name',
    CategoryCount_inProduct: '$CategoryCount_inProduct'
  }
},
//SORT: Order by CategoryCount_inProduct in descending order
{
  $sort: {
    CategoryCount_inProduct: -1,
    category_id: 1
  }
},
//LIMIT: limit to the top 3 result
{
    $limit: 3
}
])


/* 
-------------------------------------------------------------------------------------------------------------------
#                                                   QUERY 9                                                       #
# Stores with number of shipped orders in a time above the average shipping time (of all store), grouped by store #
-------------------------------------------------------------------------------------------------------------------
______________________________________________________________________________________________________________________________
In this query we want to show for each store the number of orders that have been shipped in a time above the average shipping 
time computed among all the orders.
*/

//Calculate the 'avg_datediff' and save in a new collection 'AvgDatediffResult'
db.getCollection('Orders').aggregate([
  //MATCH: Select only the 'order_status' equal to 4
  {
    $match: {
      order_status: 4
    }
  },
  //GROUP: Group to calculate the average of days passed from 'order_date' to 'shipped_date'
  {
    $group: {
      _id: null,
      avg_datediff: {
        $avg: {
          $dateDiff: {
            startDate: '$order_date',
            endDate: '$shipped_date',
            unit: 'day'
          }
        }
      }
    }
  },
  //PROJECT: Select only the result of 'avg_datediff' 
  {
    $project: {
      _id: 0,
      avg_datediff: {$round: '$avg_datediff'}
    }
  },
  //OUT: Save it in a new collection
  {
    $out: 'AvgDatediffResult'
  }
]);

//Extract the value 'avg_datediff' from the collection 'AvgDatediffResult'
const avgDatediffResult = db.getCollection('AvgDatediffResult').findOne();
const avgDatediff = avgDatediffResult.avg_datediff;

db.getCollection('Orders').aggregate([
  //MATCH: Select only the 'order_status' equal to 4 
  {
    $match: {
      order_status: 4
    }
  },
  //ADDFIELDS: Add a column with the difference of 'shipped_date' and 'order_date', and the 'avf_datediff' value
  {
    $addFields: {
      datediff: {
        $dateDiff: {
          startDate: '$order_date',
          endDate: '$shipped_date',
          unit: 'day'
        }
      },
      avg_datediff: avgDatediff
    }
  },
  //LOOKUP: join with 'Stores'
  {
    $lookup: {
      from: 'Stores',
      localField: 'store_id',
      foreignField: 'store_id',
      as: 'store_result'
    }
  },
  //UNWIND: Deconstructs an array field from the input documents to output a document for each element.
  {
    $unwind: '$store_result'
  },
  //PROJECT: Select only the relevant columns for an easy calculation
  {
    $project: {
      store_id: 1,
      avg_datediff: 1,
      datediff: 1,
      store_name: '$store_result.store_name',
      city: '$store_result.city',
      state: '$store_result.state'
    }
  },
  //MATCH: Select only the document that have the value of 'datediff' greather than 'avg_datediff'
  {
    $match: {
      $expr: { $gt: ['$datediff', '$avg_datediff']}
    }
  },
  //GROUP: Grouped by 'store_id', 'store_name', 'city' and 'state' and sum the number of orders from this grouping
  {
    $group: {
      _id: {
        store_id: '$store_id',
        store_name: '$store_name',
        city: '$city',
        state: '$state'
      },
      numberoforders: { $sum: 1 }
    }
  },
  //PROJECT: Select only the relevant columns
  {
    $project: {
      _id: 0,
      store_id: '$_id.store_id',
      numberoforders: '$numberoforders',
      store_name: '$_id.store_name',
      city: '$_id.city',
      state: '$_id.state'
    }
  },
  //SORT: Order in descendigly way, the 'numberoforders' values
  {
    $sort: {
        numberoforders: -1
    }
  }
]);




/* 
------------------------------------------------------------------------
#                             QUERY 10                                 #
#   Number of not available products in the Mountain (bike) category   #
------------------------------------------------------------------------
______________________________________________________________________________________________________________________________
With this query we want to show the number of not available products in the Mountain (bike) category.
*/

db.getCollection('Stocks').aggregate([
  //LOOKUP: Join with the products collection to get products details
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
//GROUP: Group by category_name and count the number of not avilable products per category
{
  $group: {
    _id: { category_name: '$category_details.category_name'},
    NumberOfNotAvailableProducts: { $count: {}}
  }
},
//MATCH: Selects only the documents in which appear the word 'mountain'
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
