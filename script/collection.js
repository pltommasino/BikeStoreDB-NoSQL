// Select the database to use
use('BikeStoreDB');

// Brands collection schema validation
db.createCollection("Brands", {
    // jsonSchema operator in order to set JSON schema validation rules
    validator: { $jsonSchema: {
        // setting the required keys 
        required: [ "brand_id", "brand_name"],
        // setting the allowed data types for each key
        properties: {
            brand_id: { bsonType: "int" },
            brand_name: { bsonType: "string"}
        }
    }
}
} );

// Unique index creation in Brands collection
db.Brands.createIndex( { brand_id: 1 }, { unique: true});

// Categories collection schema validation
db.createCollection("Categories", {
    // jsonSchema operator in order to set JSON schema validation rules
    validator: { $jsonSchema: {
        // setting the required keys
        required: [ "category_id", "category_name"],
        // setting the allowed data types for each key
        properties: {
            category_id: { bsonType: "int" },
            category_name: { bsonType: "string"}
        }
    }
}
} );

// Unique index creation in Categories collection
db.Categories.createIndex( { category_id: 1 }, { unique: true});

// Customers collection schema validation
db.createCollection("Customers", {
    // jsonSchema operator in order to set JSON schema validation rules
    validator: { $jsonSchema: {
        // setting the required keys
        required: [ "customer_id", "first_name", "last_name", "phone", "email", "street", "city", "state", "zip_code"],
        // setting the allowed data types for each key
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

// Unique index creation in Customers collection
db.Customers.createIndex( { customer_id: 1 }, { unique: true});

// Order_items collection schema validation
db.createCollection("Order_items", {
    // jsonSchema operator in order to set JSON schema validation rules
    validator: { $jsonSchema: {
        // setting the required keys
        required: [ "order_id", "item_id", "product_id", "quantity", "list_price", "discount"],
        // setting the allowed data types for each key
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

// Unique index creation in Order_items collection
db.Order_items.createIndex( { order_id: 1, item_id: 1 }, { unique: true});

// Orders collection schema validation
db.createCollection("Orders", {
    // jsonSchema operator in order to set JSON schema validation rules
    validator: { $jsonSchema: {
        // setting the required keys
        required: [ "order_id", "customer_id", "order_status", "order_date", "required_date", "shipped_date", "store_id", "staff_id"],
        // setting the allowed data types for each key
        properties: {
            order_id: { bsonType: "int" },
            customer_id: { bsonType: "int"},
            order_status: { bsonType: "int"},
            order_date: { bsonType: ["string", "date"]},
            required_date: { bsonType: ["string", "date"]},
            shipped_date: { bsonType: ["string", "null", "date"]},
            store_id: {bsonType: "int"},
            staff_id: {bsonType: "int"}
        }
    }
}
} );

// Unique index creation in Orders collection
db.Orders.createIndex( { order_id: 1 }, { unique: true});

// Products collection schema validation 
db.createCollection("Products", {
    // jsonSchema operator in order to set JSON schema validation rules
    validator: { $jsonSchema: {
        // setting the required keys
        required: [ "product_id", "product_name", "brand_id", "category_id", "model_year", "list_price"],
        // setting the allowed data types for each key
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

// Unique index creation in Products collection
db.Products.createIndex( { product_id: 1 }, { unique: true});

// Staffs collection schema validation
db.createCollection("Staffs", {
    // jsonSchema operator in order to set JSON schema validation rules
    validator: { $jsonSchema: {
        // setting the required keys
        required: [ "staff_id", "first_name", "last_name", "email", "phone", "active", "store_id", "manager_id"],
        // setting the allowed data types for each key
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

// Unique index creation in Staffs collection
db.Staffs.createIndex( { staff_id: 1 }, { unique: true});

// Stocks collection schema validation 
db.createCollection("Stocks", {
    // jsonSchema operator in order to set JSON schema validation rules
    validator: { $jsonSchema: {
        // setting the required keys
        required: [ "store_id", "product_id", "quantity"],
        // setting the allowed data types for each key
        properties: {
            store_id: { bsonType: "int" },
            product_id: { bsonType: "int"},
            quantity: { bsonType: "int"}
        }
    }
}
} );

// Unique index creation in Stocks collection
db.Stocks.createIndex( { store_id: 1, product_id: 1 }, { unique: true});

// Stores collection schema validation
db.createCollection("Stores", {
    // jsonSchema operator in order to set JSON schema validation rules
    validator: { $jsonSchema: {
        // setting the required keys
        required: [ "store_id", "store_name", "phone", "email", "street", "city", "state", "zip_code"],
        // setting the allowed data types for each key
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

// Unique index creation in Stores collection
db.Stores.createIndex( { store_id: 1 }, { unique: true});
