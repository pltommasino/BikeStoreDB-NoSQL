#Import MongoClient from pymongo module to connect to MongoDB
from pymongo import MongoClient
#Import the os module to interact with the operating system
import os
#Import the load_dotenv function from the dotenv module
from dotenv import load_dotenv
#Import pandas for handling CSV files
import pandas as pd

#Load environment variables from the .env file
load_dotenv()
#Get the MongoDB connection URI from the environment variables
mongodb_uri = os.getenv('MONGODB_URI_BIKESTOREDB')
#Create a connection to the MongoDB Atlas cluster using the connection URI
client = MongoClient(mongodb_uri)
#Select the database
db = client['BikeStoreDB']

#Define function to import CSV to MongoDB
def import_csv_to_mongodb(csv_filepath, collection_name):
    #Load the CSV data into a pandas DataFrame
    df = pd.read_csv(csv_filepath)
    #Convert the DataFrame to a list of dictionaries
    data = df.to_dict(orient='records')
    #Get the collection
    collection = db[collection_name]
    #Insert the data into the collection
    collection.insert_many(data)