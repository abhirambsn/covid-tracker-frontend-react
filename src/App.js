import Graph from "./components/Graph";
import Navbar from "./components/Navbar";
import Table from "./components/Table";
import WorldWideStatsCard from "./components/WorldWideStatsCard";

function App() {
  return (
    <>
      <Navbar />
      <WorldWideStatsCard />
      <Table />
      <Graph />
    </>
  );
}

export default App;
