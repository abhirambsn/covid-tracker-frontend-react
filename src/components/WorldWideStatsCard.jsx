import React from "react";
import axios from "axios";

import "../styles/card.css";

const WorldWideStatsCard = () => {
  const [stats, setStats] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    async function loadWWData() {
      const resp = await axios.get("https://api.covid19api.com/summary");
      const globalData = resp.data.Global;
      setStats(globalData);
      setLoading(false);
    }
    loadWWData();
  }, []);
  return (
    <div className="container">
      <h1 className="heading">World Data</h1>
      {!loading ? (
        <div className="card-container">
          <div className="card card-blue">
            <div className="card-title">
              <p>Total Confirmed Cases</p>
            </div>
            <div className="card-text">
              <strong>{stats?.TotalConfirmed?.toLocaleString()}</strong>
            </div>
          </div>
          <div className="card card-red">
            <div className="card-title">
              <p>Total Deaths</p>
            </div>
            <div className="card-text">
              <strong>{stats?.TotalDeaths?.toLocaleString()}</strong>
            </div>
          </div>
          <div className="card card-green">
            <div className="card-title">
              <p>Total Recovered</p>
            </div>
            <div className="card-text">
              <strong>{stats?.TotalRecovered?.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default WorldWideStatsCard;
