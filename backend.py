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
# data_list = [{"processor_id": k, **v} for k, v in json_data.items()]
# print(data_list[0:10])
# _ = collection.delete_many({})
# result = collection.insert_many(data_list)
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
        # return jsonify(data), 200
        
        #clean and aggregate the counts of unique cores for every unique product collection
        unique_cores = set()
        prod_collection = []
        for processor in data:
            if "num_cores" not in processor.keys():
                continue
            unique_cores.add(processor["num_cores"])
        cores_collection = {x+" Cores": [] for x in unique_cores}
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
        query_pipeline = [{"$project": {"_id": 0, "processor_id": {"$toInt": "$processor_id"}, "name": 1, "product_collection": "$Essentials.Product Collection", \
            "status": "$Essentials.Status", "vertical_segment": "$Essentials.Vertical Segment", "launch_date": "$Essentials.Launch Date", "num_cores": {"$toInt":"$Performance.# of Cores"}, \
            "base_frequency": "$Performance.Processor Base Frequency", "cache": "$Performance.Cache", "tdp": "$Performance.TDP", \
            "lithography": "$Essentials.Lithography", "instruction_set": "$Advanced Technologies.Instruction Set"}}]
        data = list(collection.aggregate(query_pipeline))
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/processors/<processorIDs>', methods=['GET'])
def get_processors(processorIDs):
    try:
        pids = processorIDs.split(",")
        query_pipeline = [{"$match": {"processor_id": {"$in": pids}}}, \
            {"$project": {"_id": 0}} ]
        data = list(collection.aggregate(query_pipeline))
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/compare_processors/<processorIDs>', methods=['GET'])
def get_compare_processors(processorIDs):
    try:
        pids = processorIDs.split(",")
        query_pipeline = [{"$match": {"processor_id": {"$in": pids}}}, \
            {"$project": {"_id": 0}} ]
        data = list(collection.aggregate(query_pipeline))
        
        main_features = list({feature for processor in data for feature in processor.keys()})

        final_transformed = {}
        
        for feature in main_features:
            if feature == "name" or feature == "processor_id":
                continue
            final_transformed[feature] = []
            for item in data:
                final_transformed[feature].append(item.get(feature, {}))
        
        final_transformed["Name"] = []
        final_transformed["Processor ID"] = []
        for processor in data:
            final_transformed["Name"].append({"Name":processor["name"]})
            final_transformed["Processor ID"].append({"Processor ID":processor["processor_id"]})

        broken_data = []
        for processor in data:
            curr_processor  = {}
            for feature, feature_info in processor.items():
                if feature == "name":
                    curr_processor["Name"] = processor["name"]
                elif feature == "processor_id":
                    curr_processor["Processor ID"] = processor["processor_id"]
                else:
                    for ad_feature, ad_feature_info in feature_info.items():
                        curr_processor[ad_feature] = ad_feature_info
            broken_data.append(curr_processor)

        return jsonify({"processors": final_transformed, "broken_processors": broken_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)
