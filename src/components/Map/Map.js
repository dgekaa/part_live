import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { defaultColor } from "../../constants";

import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

import "leaflet/dist/leaflet.css";

const CloseBTN = styled.span`
    position: absolute;
    top: 20px;
    left: 85%;
    height: 25px;
    width: 25px;
    display: -webkit-box;
    z-index: 1001;
    display: -ms-flexbox;
    display: flex;
    font-size: 25px;
    justify-content: center;
    align-items: center;
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
  BtnWrap = styled.div`
    display: flex;
    margin-top: 10px;
    margin-left: 20px;
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

const Map = ({
  togglePopupGoogleMap,
  initialCenterMap,
  chooseNewAddress,
  isNewAddress,
  styleContainerMap,
  closeBtn,
  height,
}) => {
  const initialCenter = initialCenterMap || {
    lat: 53.904241,
    lng: 27.556932,
  };

  const [streetName, setStreetName] = useState(""),
    [latLng, setLatLng] = useState(""),
    [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    if (!mapRef) return;

    const locationIcon = L.icon({
      iconUrl: `${process.env.PUBLIC_URL}/img/location.png`,
      iconSize: [22, 22],
    });

    L.marker([initialCenter.lat, initialCenter.lng], {
      icon: locationIcon,
    }).addTo(mapRef);

    if (!isNewAddress) return;

    const provider = new OpenStreetMapProvider();
    new GeoSearchControl({
      provider: provider,
      style: "bar",
      showPopup: false,
      marker: {
        icon: L.icon({
          iconUrl: `${process.env.PUBLIC_URL}/img/location.png`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        }),
        draggable: true,
      },
    }).addTo(mapRef);

    mapRef.on("geosearch/showlocation", (data) => {
      console.log(data.location, "---1");
      const { x, y, label } = data.location;
      setLatLng({ lat: y, lng: x });
      setStreetName(label);
    });

    mapRef.on("geosearch/marker/dragend", (data) => {
      console.log(data.location, "---2");
      const { lat, lng } = data.location;
      setLatLng({ lat: lat, lng: lng });
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${data.location.lat}&lon=${data.location.lng}`
      )
        .then((res) => res.json())
        .then((res) => {
          setStreetName(res.address.road);
          console.log(res.address, "-res address");
        })
        .catch((err) => console.log("address err", err));
    });
  }, [mapRef]);

  const save = () => {
    if (streetName && latLng) chooseNewAddress(streetName, latLng);
  };

  return (
    <MapContainerStyle style={styleContainerMap}>
      <MapContainer
        whenCreated={(mapInstance) => setMapRef(mapInstance)}
        style={{ height: height || "100vh" }}
        center={initialCenter}
        zoom={14}
        maxNativeZoom={19}
        maxZoom={20}
      >
        {isNewAddress && (
          <div
            style={{
              zIndex: 1001,
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <BtnWrap>
              <SaveBtn onClick={() => save()}>СОХРАНИТЬ</SaveBtn>
              <CancelBtn onClick={togglePopupGoogleMap}>ОТМЕНА</CancelBtn>
            </BtnWrap>
          </div>
        )}
        {closeBtn && <CloseBTN onClick={togglePopupGoogleMap}>&#215;</CloseBTN>}
        <TileLayer
          maxZoom={20}
          maxNativeZoom={19}
          attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
          url={
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          }
        />
      </MapContainer>
    </MapContainerStyle>
  );
};

export default Map;
