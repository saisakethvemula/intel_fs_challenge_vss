from flask import Flask, jsonify, request
from pymongo import MongoClient, InsertOne
import json

app = Flask(__name__)

# connect to atlas
client = MongoClient("mongodb+srv://intelvss:intelvss@intelcluster.vjyho2u.mongodb.net/?retryWrites=true&w=majority&appName=intelCluster")
db = client.intel_fs_challenge
collection = db.processor_config

#inserting data into collection
# with open(r"./API_DATA.json") as f:
#     json_data = json.load(f)
# processor_data = []
# for pid, feature in json_data.items():
#     processor_data.append({"Processor ID": pid, "Processor Name": feature.pop("name"), **feature})
# print(processor_data[0:10])
# _ = collection.delete_many({})
# result = collection.insert_many(processor_data)
# print("Inserted document IDs:", result.inserted_ids)


@app.route('/graph', methods=['GET'])
def get_graph_data():
    try:
        #bar graph data
        #query to get the product collection and number of cores for different processors.
        query_pipeline = [
            {"$project": {"_id": 0, "product_collection": "$Essentials.Product Collection", "num_cores": "$Performance.# of Cores"}}
        ]
        data = list(collection.aggregate(query_pipeline))
        #return jsonify(data), 200
        #clean and aggregate the counts of unique cores for every unique product collection
        unique_cores = set()
        prod_collection = []
        # getting all unique core counts available in the processors data
        for processor in data:
            if "num_cores" not in processor.keys():
                continue
            unique_cores.add(processor["num_cores"])
        cores_collection = {x+" Cores": [] for x in unique_cores}
        #aggregating the count of the cores for every processor
        for processor in data:
            if "num_cores" not in processor.keys():
                continue
            current_collection = processor["product_collection"]
            if current_collection not in prod_collection:
                prod_collection.append(current_collection)
                cores_collection = {k: v + [0] for k, v in cores_collection.items()}
            prod_index = prod_collection.index(current_collection) 
            cores_collection[processor["num_cores"]+" Cores"][prod_index] += 1

        #pie chart data
        #query to get the processor status.
        query_pipeline = [
            {"$project": {"_id": 0, "processor_status": "$Essentials.Status"}}
        ]
        data = list(collection.aggregate(query_pipeline))

        #clean and aggregate to get the count of unique processor status
        processor_statuses = {}
        for processor in data:
            status = processor["processor_status"]
            processor_statuses[status] = processor_statuses.get(status, 0) + 1

        return jsonify({"bardata":[prod_collection, cores_collection], "piedata":processor_statuses}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/table', methods=['GET'])
def get_table_data():
    try:
        #table data
        #aggregating data for displaying in table
        query_pipeline = [{"$project": {"_id": 0, "Processor ID": {"$toInt": "$Processor ID"}, "Processor Name": 1, "Product Collection": "$Essentials.Product Collection", \
            "Status": "$Essentials.Status", "Vertical Segment": "$Essentials.Vertical Segment", "Launch Date": "$Essentials.Launch Date", "Number of Cores": {"$toInt":"$Performance.# of Cores"}, \
            "Base Frequency": "$Performance.Processor Base Frequency", "Cache": "$Performance.Cache", "TDP": "$Performance.TDP", \
            "Lithography": "$Essentials.Lithography", "Instruction Set": "$Advanced Technologies.Instruction Set"}}]
        data = list(collection.aggregate(query_pipeline))
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @app.route('/processors/<processorIDs>', methods=['GET'])
# def get_processors(processorIDs):
#     try:
#         pids = processorIDs.split(",")
#         query_pipeline = [{"$match": {"Processor ID": {"$in": pids}}}, \
#             {"$project": {"_id": 0}} ]
#         data = list(collection.aggregate(query_pipeline))
#         return jsonify(data), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route('/processors/')
@app.route('/processors/<processorIDs>', methods=['GET'])
def get_processors(processorIDs=None):
    try:
        #api for lazy loading
        #sending detailed processor data only on request
        if processorIDs is None:
            return jsonify({"processors": [], "broken_processors": []}), 200
        pids = processorIDs.split(",")
        query_pipeline = [{"$match": {"Processor ID": {"$in": pids}}}, \
            {"$project": {"_id": 0}} ]
        data = list(collection.aggregate(query_pipeline))
        
        #getting unique features of processors for table header
        main_features = list({feature for processor in data for feature in processor.keys()})

        #transforming the data to suit the table column names
        final_transformed = {}
        for feature in main_features:
            if feature == "Processor Name" or feature == "Processor ID":
                continue
            final_transformed[feature] = []
            for item in data:
                final_transformed[feature].append(item.get(feature, {}))
        #transforming the data to dynamically update in table
        final_transformed["Processor Name"] = []
        final_transformed["Processor ID"] = []
        for processor in data:
            final_transformed["Processor Name"].append({"Processor Name":processor["Processor Name"]})
            final_transformed["Processor ID"].append({"Processor ID":processor["Processor ID"]})
        
        #transforming the data to dynamically update in table rows
        broken_data = []
        for processor in data:
            curr_processor  = {}
            for feature, feature_info in processor.items():
                if feature == "Processor Name" or feature == "Processor ID":
                    curr_processor[feature] = processor[feature]
                else:
                    for ad_feature, ad_feature_info in feature_info.items():
                        curr_processor[ad_feature] = ad_feature_info
            broken_data.append(curr_processor)

        return jsonify({"processors": final_transformed, "broken_processors": broken_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)
