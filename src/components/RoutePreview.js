import React from "react";
import { getStationName } from "../data/stations";

function RoutePreview({ stations, price }) {
  if (!stations) {
    return null;
  }
  return (
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
      {price && <p>Price: {price} Eth</p>}
    </div>
  );
}

export default RoutePreview;
