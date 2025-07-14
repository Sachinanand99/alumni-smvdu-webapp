"use client";

import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const MapboxClusters = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const [geojsonData, setGeojsonData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/alumni/mapgraph");
                console.log("response", response);
                if (!response.ok) throw new Error("Failed to fetch map data");

                const geoJSON = await response.json();
                setGeojsonData(geoJSON);
            } catch (error) {
                console.error("Error fetching map data:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (!geojsonData) return;

        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/dark-v11",
            center: [0, 20],
            zoom: 2,
        });

        mapRef.current.on("load", () => {
            mapRef.current.addSource("alumni", {
                type: "geojson",
                data: geojsonData,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50,
            });

            mapRef.current.addLayer({
                id: "clusters",
                type: "circle",
                source: "alumni",
                filter: ["has", "point_count"],
                paint: {
                    "circle-color": ["step", ["get", "point_count"], "#51bbd6", 10, "#f1f075", 30, "#f28cb1"],
                    "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 30, 40],
                },
            });

            mapRef.current.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "alumni",
                filter: ["has", "point_count"],
                layout: {
                    "text-field": ["get", "point_count_abbreviated"],
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": 12,
                },
            });

            mapRef.current.addLayer({
                id: "unclustered-point",
                type: "circle",
                source: "alumni",
                filter: ["!", ["has", "point_count"]],
                paint: {
                    "circle-color": "#11b4da",
                    "circle-radius": 4,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#fff",
                },
            });
        });

        return () => mapRef.current.remove();
    }, [geojsonData]);

    return <div ref={mapContainerRef} style={{ height: "600px", width: "100%" }} />;
};

export default MapboxClusters;