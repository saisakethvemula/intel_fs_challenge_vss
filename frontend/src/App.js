// import logo from './logo.svg';
import './App.css';
import {
  Route,
  Router,
  Routes,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from './pages/Dashboard';
import Graph from './pages/Graph';
import DataTable from './pages/DataTable';
// import LazyLoadedDataTable from './pages/LazyTable';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={ <Dashboard/> } />
        <Route path="graph" element={ <Graph/> } />
        <Route path="table" element={ <DataTable/> } />
      </Routes>
    </div>
  );
}

export default App;
