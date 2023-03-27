import { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';

import AdvisoryResponse from '../assets/advisories/model';
import GeoFeatureCollection from '../assets/geojson/model';

import geoJsonData from '../assets/geojson/data';

const Map = () => {
  const [geoJsonCountries, _] = useState<GeoFeatureCollection>(geoJsonData);
  const [advisoryData, setAdvisoryData] = useState<AdvisoryResponse | null>(null)
  const [geoJsonAdvisoryData, setGeoJsonAdvisoryData] = useState(null)

  useEffect(() => {
    console.debug("Fetching advisories...")
    fetch('https://smartraveller.api.kevle.xyz/advisories')
      .then((response) => response.json())
      .then((data) => {
        setAdvisoryData(data);
        console.debug("Advisories fetched")
      });

    // Unable to fetch from this endpoint as is heavily rate limited - multiple reloads of page will 403 
    // fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_geoJsonCountries.geojson')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setGeoJsonCountries(data);
    //   });
  }, []);

  useEffect(() => {
    console.debug("Advisories fetched, combining with country GeoJSON data...")
    var data: any = advisoryData !== null ?
      {
        type: 'FeatureCollection',
        features: Object.keys(advisoryData!.advisories).map(country_iso_a2 => {
          // Find country from GeoJSON country data 
          const country = geoJsonCountries.features.find(
            (feature) => feature.properties.iso_a2 === country_iso_a2.toUpperCase()
          );

          if (country) {
            return {
              id: country_iso_a2,
              type: 'Feature',
              geometry: country.geometry,
              properties: {
                advisory_level: advisoryData!.advisories[country_iso_a2].level,
              }
            }
          }

          return null;
        })
      } : null;

    // Remove nulls 
    if (data !== null) {
      data.features = data.features.filter(notEmpty);
      setGeoJsonAdvisoryData(data);

      console.debug("Finished combining with country data");
      console.log(data);
    }
  }, [advisoryData])

  return (
    <div className="map">
      <MapContainer center={[20, 0]} zoom={2.5}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | 
          | Unofficial <a href="https://www.smartraveller.gov.au/">Smartraveller</a> Map'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonAdvisoryData !== null ?
          <GeoJSON
            data={geoJsonAdvisoryData}
            style={(feature) => ({
              fillColor:
                feature!.properties.advisory_level === 4 ? 'red' :
                feature!.properties.advisory_level === 3 ? 'orange' :
                feature!.properties.advisory_level === 2 ? 'yellow' :
                feature!.properties.advisory_level === 1 ? 'green' :
                'grey', // These should not be rendered
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            }
            )}
          /> : null // TODO: Loading state
        }
      </MapContainer>
    </div>
  );
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export default Map;
