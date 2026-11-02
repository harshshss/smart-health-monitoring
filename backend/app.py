from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Preloaded village data
villages = [
    {"id": 1, "name": "Ramnagar", "ph": 6.2, "turbidity": 80, "tds": 150, "coliform": True},
    {"id": 2, "name": "Shantinpur", "ph": 7.1, "turbidity": 10, "tds": 90, "coliform": False},
    {"id": 3, "name": "Bhavanipur", "ph": 5.8, "turbidity": 120, "tds": 200, "coliform": True},
    {"id": 4, "name": "Gokulpur", "ph": 7.5, "turbidity": 20, "tds": 100, "coliform": False},
    {"id": 5, "name": "Nongpoh", "ph": 6.9, "turbidity": 40, "tds": 130, "coliform": False},
]

def calculate_risk(v):
    if v["turbidity"] > 50 or v["coliform"]:
        return "High"
    elif v["ph"] < 6.5 or v["ph"] > 8.5:
        return "Medium"
    else:
        return "Low"

@app.route("/api/villages", methods=["GET"])
def get_villages():
    data = []
    for v in villages:
        data.append({
            "id": v["id"],
            "name": v["name"],
            "ph": v["ph"],
            "turbidity": v["turbidity"],
            "tds": v["tds"],
            "coliform": v["coliform"],
            "risk": calculate_risk(v)
        })
    return jsonify(data)

@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    alerts = []
    for v in villages:
        if calculate_risk(v) == "High":
            alerts.append({
                "village": v["name"],
                "message": f"Unsafe water detected in {v['name']}! High risk level."
            })
    return jsonify(alerts)

@app.route("/api/village/<int:village_id>", methods=["GET"])
def get_village(village_id):
    v = next((x for x in villages if x["id"] == village_id), None)
    if not v:
        return jsonify({"error": "Village not found"}), 404
    return jsonify({
        "id": v["id"],
        "name": v["name"],
        "ph": v["ph"],
        "turbidity": v["turbidity"],
        "tds": v["tds"],
        "coliform": v["coliform"],
        "risk": calculate_risk(v)
    })

if __name__ == "__main__":
    app.run(debug=True)
