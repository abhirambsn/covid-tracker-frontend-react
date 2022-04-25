import axios from "axios";
import React from "react";
import { useRecoilValue } from "recoil";
import countryAtom from "../atoms/countryAtom";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

import { DateRangePicker } from "react-date-range";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../styles/graph.css";

import { addDays } from "date-fns";

const Graph = () => {
  const [confirmedCases, setConfirmedCases] = React.useState([]);
  const [recoveredCases, setRecoveredCases] = React.useState([]);
  const [deceasedCases, setDeceasedCases] = React.useState([]);
  const [filters, setFilters] = React.useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: "filters",
  });
  const [loading, setLoading] = React.useState(false);
  const country = useRecoilValue(countryAtom);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "No. of cases vs Time",
      },
    },
  };

  React.useEffect(() => {
    setLoading(true);
    if (country !== "") {
      async function loadData(country) {
        let response = await axios.get(
          `https://api.covid19api.com/dayone/country/${country
            .toLowerCase()
            .replace(/[\])}[{(]/g, "")
            .split(" ")
            .join("-")}/status/confirmed`
        );
        setConfirmedCases(response.data);

        response = await axios.get(
          `https://api.covid19api.com/dayone/country/${country
            .toLowerCase()
            .split(" ")
            .join("-")}/status/recovered`
        );
        setRecoveredCases(response.data);

        response = await axios.get(
          `https://api.covid19api.com/dayone/country/${country
            .toLowerCase()
            .split(" ")
            .join("-")}/status/deaths`
        );
        setDeceasedCases(response.data);
        setLoading(false);
      }
      loadData(country);
    }
    setLoading(false);
  }, [country]);

  React.useEffect(() => {
    async function loadData(country) {
      let response = await axios.get(
        // https://api.covid19api.com/country/south-africa/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z
        `https://api.covid19api.com/country/${country
          .toLowerCase()
          .replace(/[\])}[{(]/g, "")
          .split(" ")
          .join(
            "-"
          )}/status/confirmed?from=${filters.startDate.toISOString()}&to=${filters.endDate.toISOString()}`
      );
      setConfirmedCases(response.data);

      response = await axios.get(
        `https://api.covid19api.com/country/${country
          .toLowerCase()
          .split(" ")
          .join(
            "-"
          )}/status/recovered?from=${filters.startDate.toISOString()}&to=${filters.endDate.toISOString()}`
      );
      setRecoveredCases(response.data);

      response = await axios.get(
        `https://api.covid19api.com/country/${country
          .toLowerCase()
          .split(" ")
          .join(
            "-"
          )}/status/deaths?from=${filters.startDate.toISOString()}&to=${filters.endDate.toISOString()}`
      );
      setDeceasedCases(response.data);
      setLoading(false);
    }
    loadData(country);
  }, [filters, country]);

  return country !== "" ? (
    <div className="container">
      <h1 className="heading">Graph for {country}</h1>
      {confirmedCases && recoveredCases && deceasedCases && !loading ? (
        <div className="graph-container">
          <div className="graph">
            <Line
              options={options}
              data={{
                labels: confirmedCases.map((d) =>
                  new Date(d.Date).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: "Confirmed",
                    data: confirmedCases.map((d) => d.Cases),
                    backgroundColor: "rgb(255, 99, 132)",
                    showLine: true,
                    pointRadius: 0.5,
                    borderColor: "rgb(255, 99, 132)",
                  },
                  {
                    label: "Recovered",
                    data: recoveredCases.map((d) => d.Cases),
                    backgroundColor: "rgb(25, 100, 132)",
                    showLine: true,
                    pointRadius: 0.5,
                    borderColor: "rgb(25, 100, 132)",
                  },
                  {
                    label: "Deaths",
                    data: deceasedCases.map((d) => d.Cases),
                    backgroundColor: "rgb(0, 200, 132)",
                    showLine: true,
                    pointRadius: 0.5,
                    borderColor: "rgb(0,200,132)",
                  },
                ],
              }}
            />
          </div>
        </div>
      ) : (
        <p>Loading Graph...</p>
      )}
      <h3 className="heading" style={{textAlign: "center"}}>Filter Graph By Date</h3>
      <div className="datePicker">
        <DateRangePicker
          ranges={[filters]}
          onChange={(item) => {
            setFilters(item.filters);
          }}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Graph;
