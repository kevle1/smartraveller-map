import { useEffect, useState } from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";

import SmartravellerAdvisoryResponse from "../assets/advisories/model";
import GeoFeatureCollection from "../assets/geojson/model";

const Map = () => {
  const [geoJsonCountries, setGeoJsonCountries] = useState<
    GeoFeatureCollection | undefined
  >();
  const [advisoryData, setAdvisoryData] =
    useState<SmartravellerAdvisoryResponse | null>(null);
  const [geoJsonAdvisoryData, setGeoJsonAdvisoryData] = useState(null);

  useEffect(() => {
    console.debug("Fetching advisories...");
    fetch("https://smartraveller.api.kevle.xyz/advisories")
      .then((response) => response.json())
      .then((data) => {
        setAdvisoryData(data);
      });

    fetch(
      "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson",
    )
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonCountries(data);
      });
  }, []);

  useEffect(() => {
    var data: any =
      advisoryData !== null && geoJsonCountries !== undefined
        ? {
            type: "FeatureCollection",
            features: advisoryData.advisories.map((advisory) => {
              const country = geoJsonCountries.features.find(
                (country) =>
                  country.properties.ISO_A2 === advisory.country.alpha_2,
              );

              if (country !== undefined) {
                return {
                  type: "Feature",
                  properties: {
                    name: advisory.country.name,
                    advisory_level: advisory.level,
                    advisory: advisory.advisory,
                    page_url: advisory.page_url,
                  },
                  geometry: country.geometry,
                };
              } else {
                return null;
              }
            }),
          }
        : null;

    // Remove nulls
    if (data !== null) {
      data.features = data.features.filter(notEmpty);
      setGeoJsonAdvisoryData(data);
      console.log(data);
    }
  }, [advisoryData]);

  return (
    <div className="map">
      <MapContainer center={[20, 0]} zoom={2.5}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors |
          | Unofficial <a href="https://www.smartraveller.gov.au/">Smartraveller</a> Map'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonAdvisoryData !== null ? (
          <GeoJSON
            data={geoJsonAdvisoryData}
            style={(feature) => ({
              fillColor:
                feature!.properties.advisory_level === 4
                  ? "red"
                  : feature!.properties.advisory_level === 3
                    ? "orange"
                    : feature!.properties.advisory_level === 2
                      ? "yellow"
                      : feature!.properties.advisory_level === 1
                        ? "green"
                        : "grey", // These should not be rendered
              weight: 2,
              opacity: 1,
              color: "white",
              dashArray: "3",
              fillOpacity: 0.7,
            })}
          />
        ) : null}
      </MapContainer>
    </div>
  );
};

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export default Map;
