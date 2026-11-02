import React, { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

function RiskBadge({risk}) {
  const style = {
    padding: "6px 10px",
    borderRadius: 6,
    color: "white",
    fontWeight: 600,
    display: "inline-block",
  };
  if (risk === "High") return <span style={{...style, background:"#D9534F"}}>HIGH</span>;
  if (risk === "Medium") return <span style={{...style, background:"#F0AD4E"}}>MEDIUM</span>;
  return <span style={{...style, background:"#5CB85C"}}>LOW</span>;
}

function App() {
  const [villages, setVillages] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState(null);

  async function fetchVillages() {
    const res = await fetch(`${API}/villages`);
    const data = await res.json();
    setVillages(data);
  }
  async function fetchAlerts() {
    const res = await fetch(`${API}/alerts`);
    const data = await res.json();
    setAlerts(data);
  }

  useEffect(() => {
    fetchVillages();
    fetchAlerts();
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        <h2>Smart Health Monitoring System (Prototype)</h2>
      </nav>

      <div className="container">
        <div className="left">
          <h3>Villages & Risk</h3>
          <table className="vtable">
            <thead>
              <tr><th>Village</th><th>District</th><th>Risk</th><th></th></tr>
            </thead>
            <tbody>
              {villages.map(v=>(
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.district}</td>
                  <td><RiskBadge risk={v.risk} /></td>
                  <td><button onClick={()=>setSelected(v)}>Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{marginTop:20}}>Alerts</h3>
          <div className="alerts">
            {alerts.length===0 && <p>No current high-risk alerts.</p>}
            {alerts.map((a,i)=>(
              <div className="alert" key={i}>
                <strong>⚠️ {a.village}</strong> — {a.message}
              </div>
            ))}
          </div>
        </div>

        <div className="right">
          <h3>Village Details</h3>
          {!selected && <p>Select a village to see water parameters and notes.</p>}
          {selected && (
            <div>
              <h4>{selected.name} <small>({selected.district})</small></h4>
              <p><strong>Risk:</strong> <RiskBadge risk={selected.risk} /></p>
              <p><strong>pH:</strong> {selected.ph}</p>
              <p><strong>Turbidity (NTU):</strong> {selected.turbidity}</p>
              <p><strong>TDS (mg/L):</strong> {selected.tds}</p>
              <p><strong>Coliform:</strong> {selected.coliform ? "Detected" : "Not detected"}</p>
              <p><strong>Notes:</strong> {selected.notes}</p>
            </div>
          )}
        </div>
      </div>

      <footer style={{textAlign:"center", padding:10, marginTop:20, color:"#666"}}>
        Demo prototype — data preloaded. Later: ML model, maps, SMS integration.
      </footer>
    </div>
  );
}

export default App;
