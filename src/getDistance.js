const deg2rad = (deg) => deg * (Math.PI / 180);

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371,
    dLat = deg2rad(lat2 - lat1),
    dLon = deg2rad(lon2 - lon1),
    a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2),
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
    d = R * c;
  return d;
};
