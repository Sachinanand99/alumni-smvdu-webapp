"use client";

import React from "react";
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';


export default function ContactMap({
                               apiKey,
                               latitude,
                               longitude,
                           }: {
    apiKey: string;
    latitude: number;
    longitude: number;
}) {
    return (
        <div className="home_map-card grow-1">
            <Map
                initialViewState={{latitude, longitude, zoom: 12}}
                mapboxAccessToken={apiKey}
                style={{width: "100%", height: "80%"}}
                mapStyle="mapbox://styles/mapbox/streets-v11"
            >
                <Marker latitude={latitude} longitude={longitude} anchor="bottom">
                </Marker>
            </Map>
        </div>
    );
}