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
          model_year: '$_id.model_year',
          list_price: '$_id.list_price',
          quantity: '$_id.quantity',
          category_name: '$_id.category_name',
          total_quantitysold: 1
      }
  }
]);