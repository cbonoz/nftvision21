import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import Fuse from "fuse.js";
import { Modal, Button } from "antd";

import { getStationName, STATIONS } from "../data/stations";

import "./Home.css";
import { purchaseContract, requestPrice, getHashUrl } from "../util/helpers";
import Invoice from "./Invoice/Invoice";
import { getWeb3 } from "../util/getWeb3";
import { initSdk } from "../util/rarible";
import RoutePreview from "./RoutePreview";
import PaymentForm from "./PaymentForm";

const options = {
  // isCaseSensitive: false,
  // includeScore: false,
  shouldSort: true,
  // includeMatches: false,
  findAllMatches: false,
  minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  keys: ["STNNAME"],
};

const lineOptions = { color: "green" };

const getLatLng = (station) => [station.Y, station.X];

const fuse = new Fuse(STATIONS, options);

export default function Home({ setAccount }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePrice, setActivePrice] = useState(undefined);
  const [stations, setStations] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(undefined);
  const [web3, setWeb3] = useState();
  const [error, setError] = useState("");
  const [map, setMap] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const login = async () => {
    try {
      const myWeb3 = await getWeb3();
      const accs = await myWeb3.eth.getAccounts();
      setAccounts(accs);
      setAccount(accs[0]);
      await initSdk(myWeb3);
      setWeb3(myWeb3);
    } catch (e) {
      console.error("error getting web3 accounts", e);
    }
  };

  useEffect(() => {
    login();
  }, []);

  const addStation = (result) => {
    setResults([]);
    const newStations = [...stations, result];
    setStations(newStations);
    map.flyTo(getLatLng(result), 12);
    if (newStations.length > 1) {
      map.fitBounds(newStations.map(getLatLng));
    }
    setQuery("");
  };

  const completePurchase = async () => {
    console.log("purchase");
    if (!accounts) {
      setError("Not currently logged in, please refresh the page.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await purchaseContract(
        stations,
        accounts[0],
        activePrice,
        web3
      );
      setPurchaseResult(res);
    } catch (e) {
      console.error("error completing purchase", e);
      setError(e.toString());
    } finally {
      setShowModal(false);
      setLoading(false);
    }
  };

  const clearStations = () => {
    setPurchaseResult(undefined);
    setActivePrice(undefined);
    setRequesting(false);
    setStations([]);
    setQuery("");
  };

  const getPriceForRoute = async () => {
    if (stations.length <= 1) {
      alert("Please select at least 2 stations");
      return;
    }

    // const positionList = stations.map(getLatLng).flat();

    setLoading(true);
    setRequesting(true);

    try {
      const price = await requestPrice(stations.length);
      setActivePrice(price);
    } catch (e) {
      console.error("error getting price", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (query) {
      setResults(fuse.search(query));
    } else {
    }
  }, [query]);

  const station = (stations && stations[stations.length - 1]) || {};

  let inputValue = "";
  if (query !== null || query) {
    inputValue = query;
  } else if (station) {
    inputValue = `${station.ADDRESS1} ${station.STNNAME}`;
  }

  const position = [station.Y || 42.36, station.X || -71.059];

  const isCompleted = purchaseResult && purchaseResult.hash;

  if (isCompleted) {
    return (
      <div className="columns">
        {/* <div className="column is-one-quarter"></div> */}
        <div className="column">
          <Invoice
            amount={activePrice}
            stations={stations}
            url={getHashUrl(purchaseResult.hash)}
          />
          <button className="m-4" onClick={clearStations}>
            Done
          </button>
        </div>
      </div>
    );
  }

  const getPrompt = () => {
    console.log("stations", stations);
    if (!stations || stations.length === 0) {
      return "Where are you starting from?";
    } else if (stations.length === 1) {
      return "Where are you going?";
    } else {
      return "Add additional stop:";
    }
  };

  return (
    <div>
      <div className="columns">
        <div className="column is-full map-container">
          <div className="box-overlay">
            {/* <b>Search for a station:</b> */}
            <b>{getPrompt()}</b>
            <input
              onChange={(e) => setQuery(e.target.value)}
              value={inputValue}
              className="input is-primary"
            />
            <br />
            {results.slice(0, 5).map((result, i) => {
              const { item } = result;
              return (
                <div
                  key={i}
                  onClick={() => addStation(item)}
                  className="result-box"
                >
                  {i + 1}: {getStationName(item)}
                </div>
              );
            })}
            {stations.length > 0 && (
              <div>
                <div>
                  <div>
                    <br />
                    <b>Last Station:</b>
                    <br />
                    {station.X} {station.Y}
                    <p>{station.STNNAME}</p>
                    <p>{station.ADDRESS1}</p>
                  </div>
                  <hr />
                  <RoutePreview stations={stations} />

                  <hr />
                  <div>
                    <b>Purchase Ticket</b>
                  </div>
                  {!requesting && (
                    <span>
                      <button
                        className="btn is-primary"
                        onClick={getPriceForRoute}
                        disabled={loading}
                      >
                        Request Price
                      </button>
                      &nbsp;
                    </span>
                  )}
                  <button
                    className="btn is-primary"
                    onClick={clearStations}
                    disabled={loading}
                  >
                    Clear Route
                  </button>
                </div>
              </div>
            )}
            {loading && <p>Transaction in progress...</p>}
            {activePrice && (
              <div>
                <RoutePreview stations={stations} price={activePrice} />
                <br />
                <button
                  className="btn is-primary"
                  onClick={() => setShowModal(true)}
                >
                  Purchase fare for {activePrice} Eth
                </button>

                <button
                  className="btn is-primary"
                  onClick={() => {
                    setRequesting(false);
                    setLoading(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <Modal
            title="Complete purchase"
            visible={showModal}
            onOk={completePurchase}
            onCancel={() => setShowModal(false)}
          >
            <RoutePreview stations={stations} price={activePrice} />
            <br />
            <hr />
            <PaymentForm />
            {error && <p className="error-text">{error}</p>}
          </Modal>
          <MapContainer
            className="leaflet-container"
            center={position}
            zoom={13}
            zoomControl={false}
            scrollWheelZoom={false}
            whenCreated={setMap}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stations.map((s, i) => (
              <Marker position={getLatLng(s)} key={i}>
                <Popup>
                  <b>STATION (stop {i + 1})</b>
                  <br />
                  {JSON.stringify(getLatLng(s))}
                  <br />
                  {s.STNNAME}
                  <br />
                  {s.ADDRESS1}
                </Popup>
              </Marker>
            ))}
            {stations.map((s, i) => (
              <Polyline
                pathOptions={lineOptions}
                positions={stations.map(getLatLng)}
                key={i}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
