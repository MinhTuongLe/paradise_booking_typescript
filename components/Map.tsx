/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import L, { LatLngExpression } from "leaflet";
import React, { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import Flag from "react-world-flags";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "@/node_modules/leaflet-geosearch/dist/geosearch.css";

import "../styles/globals.css";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  center: LatLngExpression;
  locationValue?: any;
  onSearchResult: any;
}

interface GeoSearchControlOptions {
  provider: OpenStreetMapProvider;
  style: string;
}

const Map: React.FC<MapProps> = ({ center, locationValue, onSearchResult }) => {
  const [showSearchControl, setShowSearchControl] = useState(false);

  function searchEventHandler(result: any) {
    onSearchResult(result.location);
  }
  useEffect(() => {
    if (showSearchControl) {
      const map = L.map("map");
      map.clearAllEventListeners();
      map.setView(center, 13);

      // L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      const searchControl: GeoSearchControlOptions =
        new (GeoSearchControl as any)({
          provider: new OpenStreetMapProvider(),
          style: "bar",
        });

      if (showSearchControl) {
        map.addControl(searchControl as any);
      }
      map.on("geosearch/showlocation", searchEventHandler);

      return () => {
        map.remove();
      };
    }
  }, [showSearchControl]);

  useEffect(() => {
    setShowSearchControl(true);
  }, []);

  return (
    <>
      <MapContainer
        center={center || [51, -0.09]}
        zoom={center ? 13 : 2}
        scrollWheelZoom={true}
        className="h-[35vh] rounded-lg"
      >
        <div id="map"></div>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMapa> contributors'
        />
        {locationValue ? (
          <>
            {center && (
              <Marker position={center}>
                <Popup>
                  <div className="flex justify-center items-center animate-bounce">
                    <Flag code={locationValue} className="w-10" />
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        ) : (
          <>{center && <Marker position={center} />}</>
        )}
      </MapContainer>
    </>
  );
};

export default Map;
