import React from "react";
import { useCookies } from "react-cookie";
import GoogleMap from "../../components/googleMap/GoogleMap";

import QUERY from "../../query";
import Popup from "../../components/popup/Popup";

const GoogleMapPopup = ({ togglePopupGoogleMap, DATA, props, refreshData }) => {
  const [cookies] = useCookies([]);

  const chooseNewAddress = (streetName, latLng) => {
    if (cookies.origin_data) {
      QUERY(
        {
          query: `mutation {
          updatePlace(
            input:{
              id:"${props.match.params.id}"
              address : "${streetName}"
              lat: ${latLng.lat}
              lon: ${latLng.lng}
            }
          ){id address lat lon}
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

  console.log(DATA, "---DATA");

  const initialCenterMap = DATA.lat
    ? {
        lat: Number(DATA.lat),
        lng: Number(DATA.lon),
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
