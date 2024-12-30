// import { useEffect, useMemo, useRef, useState } from "react";
// import PropTypes from "prop-types";
// import {
//   GoogleMap,
//   Marker,
//   useLoadScript,
//   Circle,
//   StandaloneSearchBox,
// } from "@react-google-maps/api";

// const GoogleMaps = ({
//   apiKey,
//   center,
//   zoom,
//   radius,
//   setLatitude,
//   style,
//   address,
//   setAddress,
//   latitude,
//   longitude,
//   setLongitude,
// }) => {
//   const { map, setMap } = useState(null);
//   const { useLoaded } = useLoadScript;
//   ({
//     googleMapsApiKey: apiKey,
//     libraries: ["places"],
//   });
//   //   const center = useMemo(
//   //     () => ({ lat: latitude, lng: longitude }),
//   //     [latitude, longitude]
//   //   );

//   const changeCoordinate = (coord, index) => {
//     const { latLng } = coord;
//     const lat = latLng.lat();
//     const lng = latLng.lng();
//     setLatitude(lat);
//     setLongitude(lng);
//   };

//   useEffect(() => {
//     map?.panTo({ lat: latitude, lng: longitude });
//   }, [latitude, longitude]);

//   const inputRef = useRef();

//   const handlePlaceChanged = () => {
//     const [place] = inputRef.current.getPlaces();

//     if (place) {
//       setAddress(place.formatted_address);
//       setLatitude(place.geometry.location.lat());
//       setLongitude(place.geometry.location.lng());
//     }
//   };

//   //   const mapRef = useRef(null);

//   //   useEffect(() => {
//   //     const existingScript = document.querySelector(
//   //       `script[src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"]`
//   //     );

//   //     // const loadGoogleMaps = () => {
//   //     //   const script = document.createElement("script");
//   //     //   script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
//   //     //   script.async = true;
//   //     //   script.defer = true;
//   //     //   window.initMap = initMap;
//   //     //   document.head.appendChild(script);
//   //     // };

//   //     // const initMap = () => {
//   //     //   if (mapRef.current && window.google) {
//   //     //     new window.google.maps.Map(mapRef.current, {
//   //     //       center: center,
//   //     //       zoom: zoom,
//   //     //     });
//   //     //   }
//   //     // };

//   //     // if (!existingScript) {
//   //     //   loadGoogleMaps();
//   //     // } else if (window.google) {
//   //     //   initMap();
//   //     // }

//   //     return () => {
//   //       // Clean up the window.initMap function
//   //       delete window.initMap;
//   //     };
//   //   }, [apiKey, center, zoom]);

//   return (
//     <div>
//       {!useLoaded ? (
//         <h1>Loading....</h1>
//       ) : (
//         <GoogleMap
//           mapContainerClassName="map-container"
//           center={center}
//           zoom={10}
//           onLoad={(map) => setMap(map)}
//         >
//           <StandaloneSearchBox
//             onLoad={(ref) => (inputRef.current = ref)}
//             onPlacesChanged={handlePlaceChanged}
//           >
//             <div className="relative ml-48 mt-[10px] w-[500px]">
//               <input
//                 type="text"
//                 className="form-control text-black rounded-full bg-white"
//                 value={address}
//                 placeholder="Search Location..."
//                 onChange={(e) => setAddress(e.target.value)}
//               />
//             </div>
//             <button
//               onClick={() => map.panTo({ lat: latitude, lng: longitude })}
//             >
//               <span>Click me!</span>
//             </button>
//           </StandaloneSearchBox>
//           <Marker
//             draggable
//             animation={google.maps.Animation.DROP}
//             onDragEnd={changeCoordinate}
//             position={{ lat: latitude, lng: longitude }}
//           />
//           <Circle
//             options={{
//               fillColor: "#FF0000",
//               strokeOpacity: 0.8,
//               strokeColor: "#FF0000",
//               strokeWeight: 2,
//               fillOpacity: 0.35,
//             }}
//           />
//         </GoogleMap>
//       )}
//     </div>
//   );
// };

// // GoogleMap.defaultProps = {
// //   center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
// //   zoom: 12,
// // };

// GoogleMap.propTypes = {
//   apiKey: PropTypes.string.isRequired,
//   center: PropTypes.shape({
//     lat: PropTypes.number.isRequired,
//     lng: PropTypes.number.isRequired,
//   }).isRequired,
//   zoom: PropTypes.number.isRequired,
// };

// export default GoogleMap;
