import React, { useState, useEffect } from "react";
import "./App.css";

import "bulma/css/bulma.css";
import Home from "./components/Home";
import { APP_DESC, APP_NAME } from "./util/constants";

function App() {
  // useEffect(() => {
  //   initContractInstance();
  // }, []);

  return (
    <div className="App">
      <nav
        className="navbar is-light"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <span className="font-bold">
              <b>{APP_NAME}</b> | {APP_DESC}
            </span>
          </a>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      </nav>

      <Home />
    </div>
  );
}

export default App;
