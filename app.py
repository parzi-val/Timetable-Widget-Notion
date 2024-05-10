from flask import Flask, jsonify
from main import response
from flask_cors import CORS
app = Flask(__name__)
CORS(app) 

@app.route('/',methods=['GET'])
def get_rooms():
    return jsonify(response(4))

if __name__ == '__main__':
    app.run(debug=True)