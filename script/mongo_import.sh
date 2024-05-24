#!/bin/sh

mongoimport --type csv --headerline --db BikeStoreDB --collection Brands --file /Users/pasquale/Documents/GitHub/BikeStoreDB-NoSQL/data/brands.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Categories  --file /Users/pasquale/Documents/GitHub/BikeStoreDB-NoSQL/data/categories.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Customers  --file /Users/pasquale/Documents/GitHub/BikeStoreDB-NoSQL/data/customers.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Order_items  --file /Users/pasquale/Documents/GitHub/BikeStoreDB-NoSQL/data/order_items.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Orders  --file /Users/pasquale/Documents/GitHub/BikeStoreDB-NoSQL/data/orders.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Products  --file /Users/pasquale/Documents/GitHub/BikeStoreDB-NoSQL/data/products.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Staffs  --file /Users/pasquale/Documents/GitHub/BikeStoreDB-NoSQL/data/staffs.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Stocks  --file /Users/pasquale/Documents/GitHub/BikeStoreDB-NoSQL/data/stocks.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Stores  --file /Users/pasquale/Documents/GitHub/BikeStoreDB-NoSQL/data/stores.csv