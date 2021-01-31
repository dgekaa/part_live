import React from "react";
import { useCookies } from "react-cookie";
import GoogleMap from "../../components/googleMap/GoogleMap";

import QUERY from "../../query";
import Popup from "../../components/popup/Popup";

const GoogleMapPopup = ({ togglePopupGoogleMap, DATA, props, refreshData }) => {
  const [cookies] = useCookies([]);

  const chooseNewAddress = (streetName, latLng) => {
    if (cookies.origin_data) {
      const stringLatLng = "" + latLng.lat + "," + latLng.lng;

      QUERY(
        {
          query: `mutation {
          updatePlace(
            input:{
              id:"${props.match.params.id}"
              address : "${streetName}"
              coordinates: "${stringLatLng}"
            }
          ){id address coordinates}
        }`,
        },
        cookies.origin_data
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.errors) {
            togglePopupGoogleMap();
            refreshData();
          }
        })
        .catch((err) => console.log(err, "ADMIN UPDATEPLACE ERR"));
    }
  };

  const initialCenterMap = DATA.coordinates
    ? {
        lat: Number(DATA.coordinates.split(",")[0]),
        lng: Number(DATA.coordinates.split(",")[1]),
      }
    : null;

  return (
    <Popup
      togglePopup={togglePopupGoogleMap}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <GoogleMap
        initialCenterMap={initialCenterMap}
        togglePopupGoogleMap={togglePopupGoogleMap}
        chooseNewAddress={chooseNewAddress}
        isNewAddress
      />
    </Popup>
  );
};

export default GoogleMapPopup;
