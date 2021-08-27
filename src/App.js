import React, { useState, useEffect } from "react";
import "./App.css";

import Home from "./components/Home";
import { APP_DESC, APP_NAME } from "./util/constants";

import "bulma/css/bulma.css";
import "react-credit-cards/es/styles-compiled.css";

function App() {
  const [account, setAccount] = useState();
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

          {account && (
            <a className="navbar-item" href="/">
              <span className="font-bold">
                Logged in: <b>{account.substring(0, 6)}</b>
              </span>
            </a>
          )}
        </div>
      </nav>

      <Home setAccount={setAccount} />
    </div>
  );
}

export default App;
