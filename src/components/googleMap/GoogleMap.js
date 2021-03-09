import React, { useState } from "react";
import { Map, Marker, InfoWindow, GoogleApiWrapper } from "google-maps-react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "react-google-places-autocomplete/dist/assets/index.css";
import styled from "styled-components";

import { API_KEY } from "../../constants";
import CustomImg from "../customImg/CustomImg";
import { defaultColor } from "../../constants";

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
  `,
  MapHeaderBtn = styled.p`
    letter-spacing: 0.5px;
    color: ${defaultColor};
    font-size: 16px;
    font-weight: normal;
  `,
  YouAreHere = styled.p`
    display: flex;
    background: rgba(0, 0, 0, 0.3);
    font-weight: bold;
    border-radius: 5px;
    letter-spacing: 1px;
    width: 80px;
    height: 25px;
    color: #fff;
    position: relative;
    justify-content: center;
    align-items: center;
    opacity: 1;
    transition: 0.3s ease all;
    &::after {
      width: 0;
      height: 0;
      content: "";
      position: absolute;
      bottom: -5px;
      border: 5px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.3);
      border-bottom: 0;
    }
  `,
  CloseBTN = styled.span`
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
    @media (max-width: 760px) {
      height: 50px;
      width: 50px;
      font-size: 40px;
      padding: 0;
      line-height: 42px;
    }
  `,
  MapContainerStyle = styled.div`
    height: 100vh;
  `,
  PointPosition = styled(CustomImg)`
    width: 50px;
    height: 50px;
    position: absolute;
    left: calc(50% - 25px);
    top: calc(50% - 45px);
  `,
  MyMap = styled(Map)`
    position: relative !important;
  `,
  AutocompleteWrap = styled.div`
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    @media (max-width: 760px) {
      top: 60px;
      flex-direction: column;
    }
  `,
  BtnWrap = styled.div`
    display: flex;
    margin-top: 10px;
    margin-left: 20px;
    @media (max-width: 760px) {
      display: none;
    }
  `,
  SaveBtn = styled.div`
    background-color: #fff;
    margin-right: 10px;
    padding: 6px;
    border-radius: 4px;
    width: 150px;
    text-align: center;
    cursor: pointer;
    font-weight: 700;
    background-color: ${defaultColor};
    color: #fff;
  `,
  CancelBtn = styled.div`
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

  const [streetName, setStreetName] = useState(""),
    [latLng, setLatLng] = useState(""),
    [toCenter, setToCenter] = useState(null),
    [companyGeolocation, setCompanyGeolocation] = useState(null),
    [dencerPosition, setDencerPosition] = useState(null);

  const geocoder = new google.maps.Geocoder();

  const getStreetFromLatLng = (location) => {
      setTimeout(() => {
        setCompanyGeolocation(location);

        geocoder.geocode(
          {
            location: location,
          },
          (results, status) => {
            if (status === "OK") {
              if (results[0]) {
                setStreetName(results[0].formatted_address);
                getLatLngFromStreet(results[0].formatted_address);
              }
            } else {
              getStreetFromLatLng(location);
            }
          }
        );
      }, 300);
    },
    getLatLngFromStreet = (street, fromInput) => {
      geocoder.geocode({ address: street }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          const latLng = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          setLatLng(latLng);
          fromInput && setToCenter(latLng);
        }
      });
    },
    onDragend = (mapProps, map, e) => {
      getStreetFromLatLng({
        lat: map.center.lat(),
        lng: map.center.lng(),
      });
    };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDencerPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.log(err, " GEOLOCATION MAP ERROR")
    );
  } else {
    console.log("Геолокация недоступна");
  }

  const onPlaceSelected = (place) => {
    setStreetName(place.description);
    getLatLngFromStreet(place.description, true);
  };

  const save = () => {
    console.log(streetName, "---streetName");
    console.log(latLng, "---latLng");
    if (streetName && latLng) {
      chooseNewAddress(streetName, companyGeolocation || latLng);
    }
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
        {dencerPosition && (
          <Marker
            name={"Dancer"}
            title={""}
            icon={{
              url: `${process.env.PUBLIC_URL}/img/dancer.png`,
              scaledSize: { width: 30, height: 30 },
            }}
            position={dencerPosition}
          >
            <InfoWindow
              visible={true}
              style={{
                width: "100px",
                height: "100px",
                background: "red",
              }}
            >
              <YouAreHere position={dencerPosition}>Вы тут</YouAreHere>
            </InfoWindow>
          </Marker>
        )}
        <Marker
          name={"Place"}
          position={initialCenter}
          icon={{
            url: `${process.env.PUBLIC_URL}/img/location.png`,
            scaledSize: { width: 30, height: 30 },
          }}
        />
      </MyMap>
      {isNewAddress && (
        <>
          <MapHeader>
            <MapHeaderBtn onClick={togglePopupGoogleMap}>Отмена</MapHeaderBtn>
            <MapHeaderBtn onClick={() => save()}>Готово</MapHeaderBtn>
          </MapHeader>
          <PointPosition alt="pos" name={"location"} />
          <AutocompleteWrap>
            <GooglePlacesAutocomplete
              onSelect={onPlaceSelected}
              placeholder="Введите адрес"
              initialValue={streetName}
            />
            <BtnWrap>
              <SaveBtn onClick={() => save()}>СОХРАНИТЬ</SaveBtn>
              <CancelBtn onClick={togglePopupGoogleMap}>ОТМЕНА</CancelBtn>
            </BtnWrap>
          </AutocompleteWrap>
        </>
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
