import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import App from "./components/App";
import Notes from "./components/Notes";
function defaultRoute() {
    return (
        <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/notes">Notes</Link>
            </li>
            <li>
              <Link to="/topics">Topics</Link>
            </li>
          </ul>
  
          <hr />
  
          <Route exact path="/" component={Notes} />
          <Route path="/notes" component={Notes} />
          <Route path="/topics" component={App} />
        </div>
      </Router>
    )
}

export default defaultRoute;