"use client"
import React from "react";
// import {Marker} from "react-map-gl/mapbox-legacy";
import {Map} from "react-map-gl/mapbox-legacy";


export default function ContactMap({ apiKey }: { apiKey: string|undefined }) {
  const MAPBOX_TOKEN = apiKey;
  const latitude = 32.9421;
  const longitude = 74.9541;

  const viewport= {
    latitude: latitude,
    longitude: longitude,
    zoom: 12,
  };

  return (
     <div className="home_map-card grow-1">
       <Map
          initialViewState={viewport}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: "100%", height: "60%"  }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
       >
         {/*todo: fix marker*/}
         {/*<Marker latitude={latitude} longitude={longitude}></Marker>*/}
       </Map>
     </div>
  );
}
