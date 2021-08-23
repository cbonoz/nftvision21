import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import Fuse from "fuse.js";

import { getStationName, STATIONS } from "../data/stations";

import "./Home.css";
import {
  purchaseContract,
  requestPrice,
  getLastPrice,
  getHashUrl,
} from "../util/helpers";
import { EXAMPLE_PURCHASE } from "../util/receipt";
import Invoice from "./Invoice/Invoice";

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

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePrice, setActivePrice] = useState(undefined);
  const [stations, setStations] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(undefined);
  const [error, setError] = useState("");
  const [map, setMap] = useState(null);

  const getPrice = async () => {
    try {
      const data = await getLastPrice();
      console.log("get price", data);
      const price = parseFloat(data);
      if (price > 0) {
        setActivePrice(price / 1000); // Price sent in milliEth.
      } else {
        alert("Price updating...");
      }
    } catch (e) {
      console.error("error getting price", e);
    }
  };

  const addStation = (result) => {
    setResults([]);
    const newStations = [...stations, result];
    setStations(newStations);
    map.flyTo(getLatLng(result), 12);
    if (newStations.length > 1) {
      map.fitBounds(newStations.map(getLatLng));
    }
    setQuery(null);
  };

  const completePurchase = async () => {
    setLoading(true);
    try {
      const res = await purchaseContract(activePrice);
      setPurchaseResult(res);
    } catch (e) {
      console.error("error getting price", e);
    }
    setLoading(false);
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

    const positionList = stations.map(getLatLng).flat();

    setLoading(true);
    setRequesting(true);

    const start = "2021-02-07 20:00:00";
    const end = "2021-04-07 20:00:00";

    console.log("getPriceForRoute", positionList, start, end);

    try {
      await requestPrice(positionList, start, end);
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

  const isCompleted = purchaseResult && purchaseResult.transactionHash;

  if (isCompleted) {
    return (
      <div className="columns">
        {/* <div className="column is-one-quarter"></div> */}
        <div className="column">
          <Invoice
            amount={activePrice}
            stations={stations}
            url={getHashUrl(purchaseResult.transactionHash)}
          />
          <button className="m-4" onClick={clearStations}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="columns">
        <div className="column is-one-quarter p-4">
          Search for a station:
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
                  <b>Selected Station:</b>
                  <br />
                  {station.X} {station.Y}
                  <p>{station.STNNAME}</p>
                  <p>{station.ADDRESS1}</p>
                </div>
                <hr />
                {stations.length > 1 && (
                  <div>
                    <p>
                      <b>Route:</b>
                    </p>
                    {stations.map((s, i) => {
                      return (
                        <p key={i}>
                          {i + 1}. {getStationName(s)}
                          <br />
                        </p>
                      );
                    })}
                  </div>
                )}
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

                {requesting && (
                  <span>
                    <button
                      className="btn is-primary"
                      onClick={getPrice}
                      disabled={loading}
                    >
                      Check price
                    </button>
                    &nbsp;
                    <button
                      className="btn is-primary"
                      onClick={() => {
                        setRequesting(false);
                        setLoading(false);
                      }}
                    >
                      Cancel
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
          {loading && <p>Transaction in progress...</p>}
          {activePrice && (
            <div>
              <br />
              <b>Price: {activePrice} eth</b>
              <br />

              <button className="btn is-primary" onClick={completePurchase}>
                Purchase fare for {activePrice} Eth
              </button>
            </div>
          )}
        </div>

        <div className="column is-three-quarters p-4">
          <MapContainer
            className="leaflet-container"
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            whenCreated={setMap}
          >
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
