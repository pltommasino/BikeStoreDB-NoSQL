# **BIKE STORE DATABASES** :department_store: :bike:

## PRESENTATION

The purpose of this project is to use a NoSQL tool (in our case we use MongoDB, a document-based database) to manage and query to dataset. This project was carried out by Group 42 of Data Management for Data Science, consisting of:

| NAME and SURNAME | MATRICOLA | EMAIL |
| --- | --- | --- |
| Pasquale Luca Tommasino | 1912107 | tommasino.1912107@studenti.uniroma1.it | 
| Francesco Proietti | 1873188 | proietti.1873188@studenti.uniroma1.it |

## INTRO TO MONGODB

MongoDB is a document database which is often referred to as a non-relational database. This does not mean that relational data cannot be stored in document databases. It means that relational data is stored differently. A better way to refer to it is as a non-tabular database.
<br>
<br>
MongoDB stores data in flexible documents. Instead of having multiple tables you can simply keep all of your related data together. This makes reading data very fast. It can still have multiple groups of data too. In MongoDB, instead of tables these are called ***collections***.
<br>
<br>
MongoDB can be installed locally, which will allow you to host your own MongoDB server on your hardware. This requires you to manage your server, upgrades, and any other maintenance.
<br>
<br>
For this project we are going to use MongoDB from a MacOS system. Next we will only explain how we activate the MongoDB server on our computer, for more details on how you can install MongoDB Community Edition on MacOS, we recommend following this [guide](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/#std-label-brew-installs-dbtools).
<br>
<br>

Below you see the two commands on how you can start and stop the service:

- To run MongoDB (i.e. the `mongod` process) as a **macOS service**, run:

```sh
brew services start mongodb-community@7.0
```
<br>

- To stop a `mongod` running as a macOS service, use the following command as needed:

```sh
brew services stop mongodb-community@7.0
```

## SCRIPT

Three files can be found within the `script` folder:

1. `collection.js`, where we created the "skeleton" of our collections

2. `mongo_import.sh`, where with the use of `mongoimport` we were able to load CSV files (in the `data` folder) into our collections in the database created.

3. `queries.js`, where we build the queries "translated" from the SQL language of the project linked to this (see [BikeStoreDB-SQL](https://github.com/pltommasino/BikeStoreDB-SQL))


## DATA

Database is builded from the following tables:

1. Brands
> The brands table stores the brand’s information of bikes, for example, Electra, Haro, and Heller.

2. Categories
> The categories table stores the bike’s categories such as children bicycles, comfort bicycles, and electric bikes.

3. Customers
> The customers table stores customer’s information including first name, last name, phone, email, street, city, state and zip code.

4. Order_items
> The order_items table stores the line items of a sales order. Each line item belongs to a sales order specified by the order_id column. A sales order line item includes product, order quantity, list price, and discount. Order_status= 1: Pending, 2: Processing, 3: Rejected, 4: Completed

5. Orders
> The orders table stores the sales order’s header information including customer, order status, order date, required date, shipped date. It also stores the information on where the sales transaction was created (store) and who created it (staff). Each sales order has a row in the sales_orders table. A sales order has one or many line items stored in the order_items table.

6. Products
> The products table stores the product’s information such as name, brand, category, model year, and list price. Each product belongs to a brand specified by the brand_id column. Hence, a brand may have zero or many products. Each product also belongs a category specified by the category_id column. Also, each category may have zero or many products.

7. Staffs
> The staffs table stores the essential information of staffs including first name, last name. It also contains the communication information such as email and phone. A staff works at a store specified by the value in the store_id column. A store can have one or more staffs. A staff reports to a store manager specified by the value in the manager_id column. If the value in the manager_id is null, then the staff is the top manager. If a staff no longer works for any stores, the value in the active column is set to zero.

8. Stocks
> The stocks table stores the inventory information i.e. the quantity of a particular product in a specific store.

9. Stores
> The stores table includes the store’s information. Each store has a store name, contact information such as phone and email, and an address including street, city, state, and zip code.