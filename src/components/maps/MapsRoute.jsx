import { useRef, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider, CssBaseline } from "@material-ui/core";

import { allApps } from "../Navbar";

function MapsRoute() {
  useEffect(() => {
    document.querySelector("link[rel='shortcut icon']").href = allApps.find((e) => e.name === "Maps").icon;
    document.title = "Google Maps Minified";
  }, []);

  const mapContainer = useRef(null);
  const map = useRef(null);

  const theme = createTheme({
    palette: {
      type: "light",
    },
  });

  const setupMap = (longitude, latitude) => {
    mapboxgl.accessToken = "pk.eyJ1IjoibmFwdGhlZGV2IiwiYSI6ImNrczhwMm94OTJlZmwyeW80YmRsOGJyMWoifQ.4pcMl3uGpgtz1fGadOIYpg";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 10,
    });

    const nav = new mapboxgl.NavigationControl();
    map.current.addControl(nav);

    const directions = new MapboxDirections({ accessToken: mapboxgl.accessToken });
    map.current.addControl(directions, "top-left");

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map.current);
  };

  useEffect(() => {
    const defaultLocation = { latitude: 21.0278, longitude: 105.8342 };
    try {
      navigator.geolocation.getCurrentPosition(
        (res) => {
          console.log(res);
          setupMap(res.coords.longitude, res.coords.latitude);
        },
        (err) => {
          console.log(err);
          setupMap(defaultLocation.longitude, defaultLocation.latitude);
        },
        { enableHighAccuracy: true }
      );
    } catch (error) {
      console.log(error);
      setupMap(defaultLocation.longitude, defaultLocation.latitude);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div ref={mapContainer} style={{ width: "100vw", height: "100vh" }} />
    </ThemeProvider>
  );
}

export default MapsRoute;
