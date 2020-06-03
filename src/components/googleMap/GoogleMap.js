import React, { useState } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "react-google-places-autocomplete/dist/assets/index.css";
import styled from "styled-components";

import { API_KEY } from "../../constants";
import CustomImg from "../customImg/CustomImg";

import { styles } from "./GoogleMapStyles.js";
import "./googleMap.css";

const LoadingContainer = (props) => <div></div>;

const MapHeader = styled.div`
  display: none;
  @media (max-width: 760px) {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #ececec;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
    background: #fff;
  }
`;
const MapHeaderBtn = styled.p`
  letter-spacing: 0.5px;
  color: #e32a6c;
  font-size: 16px;
  font-weight: normal;
`;

const CloseBTN = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  height: 25px;
  width: 25px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 25px;
  justify-content: center;
  line-height: 21px;
  background-color: #fff;
  cursor: pointer;
  border-radius: 3px;
  &:hover {
    color: red;
  }
`;

const MapContainerStyle = styled.div`
  height: 100vh;
`;

const PointPosition = styled(CustomImg)`
  width: 50px;
  height: 50px;
  position: absolute;
  left: calc(50% - 25px);
  top: calc(50% - 45px);
`;

const MyMap = styled(Map)`
  position: relative !important;
`;

const AutocompleteWrap = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  @media (max-width: 760px) {
    top: 60px;
    flex-direction: column;
  }
`;

const BtnWrap = styled.div`
  display: flex;
  margin-top: 10px;
  margin-left: 20px;
  @media (max-width: 760px) {
    display: none;
  }
`;

const SaveBtn = styled.div`
  background-color: #fff;
  margin-right: 10px;
  padding: 6px;
  border-radius: 4px;
  width: 150px;
  text-align: center;
  cursor: pointer;
  font-weight: 700;
  background-color: #e32a6c;
  color: #fff;
`;

const CancelBtn = styled.div`
  background-color: #fff;
  margin-right: 10px;
  padding: 6px;
  border-radius: 4px;
  width: 150px;
  text-align: center;
  cursor: pointer;
  font-weight: 700;
`;

const MapContainer = ({
  google,
  togglePopupGoogleMap,
  initialCenterMap,
  chooseNewAddress,
  isNewAddress,
  styleContainerMap,
  closeBtn,
}) => {
  const initialCenter = initialCenterMap || {
    lat: 53.904241,
    lng: 27.556932,
  };

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

  const onDragend = (mapProps, map, e) => {
    getStreetFromLatLng({
      lat: map.center.lat(),
      lng: map.center.lng(),
    });
  };

  const onPlaceSelected = (place) => {
    setStreetName(place.description);
    getLatLngFromStreet(place.description, true);
  };

  return (
    <MapContainerStyle style={styleContainerMap}>
      <MyMap
        gestureHandling="greedy"
        scrollwheel={true}
        google={google}
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
          name={"Place"}
          title={"Current location"}
          position={initialCenter}
        />
      </MyMap>

      <MapHeader>
        <MapHeaderBtn onClick={togglePopupGoogleMap}>Отмена</MapHeaderBtn>
        <MapHeaderBtn
          onClick={() => {
            if (streetName && latLng) {
              chooseNewAddress(streetName, latLng);
            }
          }}
        >
          Готово
        </MapHeaderBtn>
      </MapHeader>

      {isNewAddress && <PointPosition alt="pos" name={"location"} />}
      {isNewAddress && (
        <AutocompleteWrap>
          <GooglePlacesAutocomplete
            onSelect={onPlaceSelected}
            placeholder="Введите адрес"
            initialValue={streetName}
          />
          <BtnWrap>
            <SaveBtn
              onClick={() => {
                if (streetName && latLng) {
                  chooseNewAddress(streetName, latLng);
                }
              }}
            >
              СОХРАНИТЬ
            </SaveBtn>
            <CancelBtn onClick={togglePopupGoogleMap}>ОТМЕНА</CancelBtn>
          </BtnWrap>
        </AutocompleteWrap>
      )}
      {closeBtn && <CloseBTN onClick={togglePopupGoogleMap}>&#215;</CloseBTN>}
    </MapContainerStyle>
  );
};

export default GoogleApiWrapper({
  apiKey: API_KEY,
  language: "ru",
  LoadingContainer: LoadingContainer,
})(MapContainer);
