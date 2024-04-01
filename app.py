from flask import Flask, jsonify, request
from flask_cors import CORS
from db_server import execute_query


app = Flask(__name__)
# Allow requests from all origins to the /query endpoint
# CORS(app, resources={r"/query": {"origins": "*"}})
CORS(app)


# Your existing route and function definition


@app.route('/query', methods=['POST'])
def query_endpoint():
    data = request.json
    print("Received request data:", data)
    query = data.get('query')  # Get the query from the request
    print("Query:", query)
    result = execute_query(query)
    print("Query result:", result)
    return jsonify(result)


if __name__ == '__main__':
    app.run(port=5000)
