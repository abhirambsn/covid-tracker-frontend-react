import React from "react";
import _ from "lodash";
import { gql, useQuery } from "@apollo/client";

import "../styles/table.css";
import { useRecoilState } from "recoil";
import countryAtom from "../atoms/countryAtom";

const CDATA_QUERY = gql`
  query CaseMany {
    caseMany {
      countryName
      countryCode
      newConfirmed
      totalConfirmed
      newDeaths
      newRecoverd
      totalRecovered
      totalDeath
      updatedAt
    }
  }
`;

const pageSize = 10;
const Table = () => {
  const {
    loading: cLoading,
    error: cError,
    data: cData,
  } = useQuery(CDATA_QUERY);

  const [paginatedCData, setPaginatedCData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [__, setCountry] = useRecoilState(countryAtom);

  React.useEffect(() => {
    setLoading(true);
    setPaginatedCData(_(cData?.caseMany).slice(0).take(pageSize).value());
    setLoading(false);
  }, [cData]);

  const pageCount = cData?.caseMany
    ? Math.ceil(cData.caseMany.length / pageSize)
    : 0;
  const pages = _.range(1, pageCount + 1);

  const setPaginate = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * pageSize;
    const paginatedC = _(cData?.caseMany)
      .slice(startIndex)
      .take(pageSize)
      .value();
    setPaginatedCData(paginatedC);
  };

  const search = () => {
    if (searchQuery === "") return;
    setLoading(true);
    setPaginatedCData(
      _(
        cData?.caseMany.filter((c) =>
          c.countryName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
        .slice(0)
        .take(pageSize)
        .value()
    );
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="heading">Country Table</h1>
      <form className="search-form">
        <input
          type="search"
          className="search-input"
          placeholder="Search for Country"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            search();
          }}
        />
      </form>
      {!loading ? (
        paginatedCData.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Country Name</th>
                <th>Country Code</th>
                <th>New Confirmed Cases</th>
                <th>Total Confirmed Cases</th>
                <th>New Deaths</th>
                <th>Total Deaths</th>
                <th>New Recovered</th>
                <th>Total Recovered</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCData.map((c, i) => (
                <tr key={i} onClick={() => setCountry(c.countryName)}>
                  <td>{(currentPage - 1) * pageSize + i + 1}</td>
                  <td>{c.countryName}</td>
                  <td>{c.countryCode}</td>
                  <td>{c.newConfirmed?.toLocaleString()}</td>
                  <td>{c.totalConfirmed?.toLocaleString()}</td>
                  <td>{c.newDeaths?.toLocaleString()}</td>
                  <td>{c.totalDeath?.toLocaleString()}</td>
                  <td>{c.newRecoverd?.toLocaleString()}</td>
                  <td>{c.totalRecovered?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2 style={{ textAlign: "center", margin: "20px" }}>No Result Found</h2>
        )
      ) : (
        <div>Loading</div>
      )}
      <nav
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <ul className="pagination">
          {pages.map((page) => (
            <li
              key={page}
              className={
                page === currentPage ? "page-item active" : "page-item"
              }
            >
              <p onClick={() => setPaginate(page)} className="page-link">
                {page}
              </p>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Table;
