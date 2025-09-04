import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import "leaflet/dist/leaflet.css";

const FlyToLocation = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center)) {
      map.flyTo(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

const EarthMapper = ({ searchaddress, zoom, minMag, maxMag, mode }) => {
  const mapCenter = searchaddress || [0, 0];
  const mapZoom = searchaddress ? zoom || 6 : 3;

  const [apidata, setapidata] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState("standard");

  const tileLayers = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    OpenTopoMap: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    ESRI: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  };

  useEffect(() => {
    if (selectedLayer === "standard" || selectedLayer === "dark") {
      setSelectedLayer(mode ? "standard" : "dark");
    }
  }, [mode]);

  useEffect(() => {
    const getdata = async () => {
      try {
        const res = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        );
        if (res.ok) {
          const data = await res.json();
          setapidata(data.features);
        } else {
          console.log("API not working");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getdata();
  }, []);

  const filteredData = apidata.filter((quake) => {
    const mag = quake.properties.mag || 0;
    return mag >= minMag && mag <= maxMag;
  });

  const heatmapPoints = filteredData.map((quake) => {
    const coords = quake.geometry.coordinates;
    const magnitude = quake.properties.mag || 0;
    return [coords[1], coords[0], magnitude];
  });

  return (
    <div className="h-full w-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        minZoom={3}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          key={selectedLayer}
          url={tileLayers[selectedLayer]}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <FlyToLocation center={mapCenter} zoom={mapZoom} />
        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="p-[5px] bg-gray-300 h-15 w-80 text-[15px]"
          >
            <option value="standard">OpenStreetMap</option>
            <option value="OpenTopoMap">OpenTopoMap</option>
            <option value="ESRI">Satellite</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
        <HeatmapLayer
          points={heatmapPoints}
          longitudeExtractor={(p) => p[1]}
          latitudeExtractor={(p) => p[0]}
          intensityExtractor={(p) => p[2]}
          radius={30}
          blur={25}
          max={20}
          gradient={{
            0.2: "yellow",
            0.6: "orange",
            1.0: "red",
          }}
        />

        {filteredData.map((quake, index) => {
          const coords = quake.geometry.coordinates;
          const magnitude = quake.properties.mag;
          const place = quake.properties.place;
          return (
            <Circle
              key={index}
              center={[coords[1], coords[0]]}
              radius={5000}
              pathOptions={{
                color: "red",
                fillColor: "red",
                fillOpacity: 0.7,
              }}
            >
              <Popup>
                <strong>{place}</strong>
                <br />
                Magnitude: {magnitude}
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default EarthMapper;
