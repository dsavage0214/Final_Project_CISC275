import React from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./Pages/HomeScreen";
import DetailedTestScreen from "./Pages/DetailedTest";
import BasicTestScreen from "./Pages/BasicTest";
import { NavB } from "./Pages/NavBar";


function App() {
    /**
     * The "main" function of the application. Primarily used to route the user to the appropriate page.
     * @author Stephen Sayers
     */
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<HomeScreen/>}/>
                    <Route path="/basic-test" element={<BasicTestScreen/>}/>
                    <Route path="/detailed-test" element={<DetailedTestScreen/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App;
