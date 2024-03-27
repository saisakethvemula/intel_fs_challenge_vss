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
import NewTable from './pages/NewTable';
import Processor from './pages/Processor';
import CompareTable from './pages/Compare';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={ <Dashboard/> } />
        <Route path="graph" element={ <Graph/> } />
        <Route path="table" element={ <NewTable/> } />
        <Route path="processor/:rowIDs" element={ <Processor/> }/>
        <Route path="compare_processor/:rowIDs" element={ <CompareTable/> }/>
      </Routes>
    </div>
  );
}

export default App;
