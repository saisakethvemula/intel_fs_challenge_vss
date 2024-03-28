// import logo from './logo.svg';
import './App.css';
import {
  Route,
  Routes,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from './pages/Dashboard';
import Graph from './pages/Graph';
import Table from './pages/Table';
// import CompareTable from './pages/CompareTable';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={ <Dashboard/> } />
        <Route path="graph" element={ <Graph/> } />
        <Route path="table" element={ <Table/> } />
        {/* <Route path="processor/:rowIDs" element={ <CompareTable/> }/> */}
      </Routes>
    </div>
  );
}

export default App;
