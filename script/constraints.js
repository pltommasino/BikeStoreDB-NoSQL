use('BikeStoreDB');

// Brands collection constraints
db.createCollection("Brands", {
    validator: { $jsonSchema: {
        required: [ "brand_id", "brand_name"],
        properties: {
            brand_id: { bsonType: "int" },
            brand_name: { bsonType: "string"}
        }
    }
}
} );

db.Brands.createIndex( { brand_id: 1 }, { unique: true});

// Categories collection constraints
db.createCollection("Categories", {
    validator: { $jsonSchema: {
        required: [ "category_id", "category_name"],
        properties: {
            category_id: { bsonType: "int" },
            category_name: { bsonType: "string"}
        }
    }
}
} );

db.Categories.createIndex( { category_id: 1 }, { unique: true});

// Customers collection constraints
db.createCollection("Customers", {
    validator: { $jsonSchema: {
        required: [ "customer_id", "first_name", "last_name", "phone", "email", "street", "city", "state", "zip_code"],
        properties: {
            customer_id: { bsonType: "int" },
            first_name: { bsonType: "string"},
            last_name: { bsonType: "string"},
            phone: { bsonType: ["string", "null"]},
            email: { bsonType: "string"},
            street: { bsonType: "string"},
            city: { bsonType: "string"},
            state: { bsonType: "string"},
            zip_code: { bsonType: "int"}
        }
    }
}
} );

db.Customers.createIndex( { customer_id: 1 }, { unique: true});

// Order_items collection constraints
db.createCollection("Order_items", {
    validator: { $jsonSchema: {
        required: [ "order_id", "item_id", "product_id", "quantity", "list_price", "discount"],
        properties: {
            order_id: { bsonType: "int" },
            item_id: { bsonType: "int"},
            product_id: { bsonType: "int"},
            quantity: { bsonType: "int"},
            list_price: { bsonType: ["int", "double"]},
            discount: { bsonType: "double"},
        }
    }
}
} );

db.Order_items.createIndex( { order_id: 1, item_id: 1 }, { unique: true});

// Orders collection constraints
db.createCollection("Orders", {
    validator: { $jsonSchema: {
        required: [ "order_id", "customer_id", "order_status", "order_date", "required_date", "shipped_date", "store_id", "staff_id"],
        properties: {
            order_id: { bsonType: "int" },
            customer_id: { bsonType: "int"},
            order_status: { bsonType: "int"},
            order_date: { bsonType: "string"},
            required_date: { bsonType: "string"},
            shipped_date: { bsonType: ["string", "null"]},
            store_id: {bsonType: "int"},
            staff_id: {bsonType: "int"}
        }
    }
}
} );

db.Orders.createIndex( { order_id: 1 }, { unique: true});

// Products collection constraints
db.createCollection("Products", {
    validator: { $jsonSchema: {
        required: [ "product_id", "product_name", "brand_id", "category_id", "model_year", "list_price"],
        properties: {
            product_id: { bsonType: "int" },
            product_name: { bsonType: "string"},
            brand_id: { bsonType: "int"},
            category_id: { bsonType: "int"},
            model_year: { bsonType: "int"},
            list_price: { bsonType: ["int", "double"]},
        }
    }
}
} );

db.Products.createIndex( { product_id: 1 }, { unique: true});

// Staffs collection constraints
db.createCollection("Staffs", {
    validator: { $jsonSchema: {
        required: [ "staff_id", "first_name", "last_name", "email", "phone", "active", "store_id", "manager_id"],
        properties: {
            staff_id: { bsonType: "int" },
            first_name: { bsonType: "string"},
            last_name: { bsonType: "string"},
            email: { bsonType: "string"},
            phone: { bsonType: "string"},
            active: { bsonType: "int"},
            store_id: { bsonType: "int"},
            manager_id: { bsonType: ["int", "string", "null"]}
        }
    }
}
} );

db.Staffs.createIndex( { staff_id: 1 }, { unique: true});

// Stocks collection constraints
db.createCollection("Stocks", {
    validator: { $jsonSchema: {
        required: [ "store_id", "product_id", "quantity"],
        properties: {
            store_id: { bsonType: "int" },
            product_id: { bsonType: "int"},
            quantity: { bsonType: "int"}
        }
    }
}
} );

db.Stocks.createIndex( { store_id: 1, product_id: 1 }, { unique: true});

// Stores collection constraints
db.createCollection("Stores", {
    validator: { $jsonSchema: {
        required: [ "store_id", "store_name", "phone", "email", "street", "city", "state", "zip_code"],
        properties: {
            store_id: { bsonType: "int" },
            store_name: { bsonType: "string"},
            phone: { bsonType: "string"},
            email: { bsonType: "string"},
            street: { bsonType: "string"},
            city: { bsonType: "string"},
            state: { bsonType: "string"},
            zip_code: { bsonType: "int"}
        }
    }
}
} );

db.Stores.createIndex( { store_id: 1 }, { unique: true});
