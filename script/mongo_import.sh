#!/bin/sh

mongoimport --type csv --headerline --db BikeStoreDB --collection Brands --file /home/francesco/bike_store_files/brands.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Categories  --file /home/francesco/bike_store_files/categories.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Customers  --file /home/francesco/bike_store_files/customers.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Order_items  --file /home/francesco/bike_store_files/order_items.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Orders  --file /home/francesco/bike_store_files/orders.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Products  --file /home/francesco/bike_store_files/products.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Staffs  --file /home/francesco/bike_store_files/staffs.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Stocks  --file /home/francesco/bike_store_files/stocks.csv
mongoimport --type csv --headerline --db BikeStoreDB --collection Stores  --file /home/francesco/bike_store_files/stores.csv
