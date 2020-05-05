import React, { useState } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "react-google-places-autocomplete/dist/assets/index.css";

import { API_KEY } from "../../constants";
import CustomImg from "../customImg/CustomImg";

import { styles } from "./GoogleMapStyles.js";
import "./googleMap.css";

const LoadingContainer = (props) => <div></div>;

const MapContainer = ({
  google,
  togglePopupGoogleMap,
  initialCenterMap, //изначальный центр карты или центр минска
  chooseNewAddress, //выбор адреса (street latLng)
  isNewAddress, //функционал для выбора адреса
  styleContainerMap,
  closeBtn, //крестик
}) => {
  const initialCenter = initialCenterMap || {
    lat: 53.904241,
    lng: 27.556932,
  }; // Минск

  const initialZoom = 12;

  const [streetName, setStreetName] = useState("");
  const [latLng, setLatLng] = useState("");
  const [toCenter, setToCenter] = useState(null);

  const geocoder = new google.maps.Geocoder();

  const getStreetFromLatLng = (location) => {
    setTimeout(() => {
      geocoder.geocode(
        {
          location: location,
        },
        (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              setStreetName(results[0].formatted_address);
              getLatLngFromStreet(results[0].formatted_address);
            } else {
            }
          } else {
            getStreetFromLatLng(location);
          }
        }
      );
    }, 300);
  };

  const getLatLngFromStreet = (street, fromInput) => {
    geocoder.geocode({ address: street }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        const latLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        setLatLng(latLng);
        fromInput && setToCenter(latLng);
      } else {
      }
    });
  };

  const onReady = (mapProps, map) => {};
  const mapClicked = (mapProps, map, e) => {};
  const onDragend = (mapProps, map, e) => {
    getStreetFromLatLng({
      lat: map.center.lat(),
      lng: map.center.lng(),
    });
  };
  const onMarkerClick = (props, marker, e) => {};

  const onPlaceSelected = (place) => {
    setStreetName(place.description);
    getLatLngFromStreet(place.description, true);
  };

  return (
    <div className="MapContainerStyle" style={styleContainerMap}>
      <Map
        scrollwheel={true}
        className="myMap"
        google={google}
        onReady={onReady}
        onClick={mapClicked}
        onDragend={isNewAddress && onDragend}
        zoom={initialZoom}
        initialCenter={initialCenter}
        center={toCenter}
        styles={styles}
        zoomControl={false}
        mapTypeControl={false}
        scaleControl={false}
        streetViewControl={false}
        panControl={false}
        rotateControl={false}
        fullscreenControl={false}
      >
        <Marker
          onClick={onMarkerClick}
          name={"Place"}
          title={"Current location"}
          position={initialCenter}
          // icon={{
          //   url: "/path/to/custom_icon.png",
          //   anchor: new google.maps.Point(32, 32),
          //   scaledSize: new google.maps.Size(64, 64)
          // }}
        />
      </Map>

      {isNewAddress && (
        <CustomImg alt="!" className="pointPosition" name={"location"} />
      )}
      {isNewAddress && (
        <div className="inputBtnsWrap">
          <GooglePlacesAutocomplete
            onSelect={onPlaceSelected}
            placeholder="Введите адрес"
            initialValue={streetName}
          />
          <div className="newAddressBtnWrap">
            <div
              className="chooseNewAddressBtn"
              onClick={() => {
                if (streetName && latLng) {
                  chooseNewAddress(streetName, latLng);
                }
              }}
            >
              СОХРАНИТЬ
            </div>
            <div className="cancelNewAddressBtn" onClick={togglePopupGoogleMap}>
              ОТМЕНА
            </div>
          </div>
        </div>
      )}
      {closeBtn && (
        <div className="closeBtn" onClick={togglePopupGoogleMap}>
          &#215;
        </div>
      )}
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: API_KEY,
  language: "ru",
  LoadingContainer: LoadingContainer,
})(MapContainer);
