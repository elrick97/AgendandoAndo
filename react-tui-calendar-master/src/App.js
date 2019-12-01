import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//Our components
import Calendar from "./AdminCalendar";
import Agenda from "./AgendaView"

function App() {
  return (
    <div>
      <Router>
        <div>
          <Route path="/" exact component={Calendar} />
          <Route path="/agenda" exact component={Agenda} />
        </div>
      </Router>
    </div>
  );
}
export default App;