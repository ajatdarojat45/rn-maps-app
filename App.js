import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Animated } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function App() {
  const [iMarker, setIMarker] = useState(null);
  const [markers, setMarkers] = useState([
    {
      coordinate: {
        latitude: 45.5230786,
        longitude: -122.6701034,
      },
      title: "Third Best Place",
      description: "This is the third best place in Portland",
    },
    {
      coordinate: {
        latitude: 45.521016,
        longitude: -122.6561917,
      },
      title: "Fourth Best Place",
      description: "This is the fourth best place in Portland",
    },
  ]);
  const [region, setRegion] = useState({
    latitude: 45.52220671242907,
    longitude: -122.6653281029795,
    latitudeDelta: 0.04864195044303443,
    longitudeDelta: 0.040142817690068,
  });
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${markers[0].coordinate.latitude}, ${markers[0].coordinate.longitude}&key=YOURAPIKEY&destination=${markers[1].coordinate.latitude}, ${markers[1].coordinate.longitude}&mode=walking`
    )
      .then((resp) => resp.json())
      .then((data) => {
        var tempRoutes = data.routes[0].legs[0].steps.map((step, i) => {
          return {
            latitude: step.end_location.lat,
            longitude: step.end_location.lng,
          };
        });
        setRoutes([
          {
            latitude: markers[0].coordinate.latitude,
            longitude: markers[0].coordinate.longitude,
          },
          ...tempRoutes,
        ]);
      });
  }, [markers]);

  const handleDragStart = (e) => {
    const index = markers.findIndex(
      (item) =>
        item.coordinate.latitude === e.coordinate.latitude &&
        item.coordinate.longitude === e.coordinate.longitude
    );
    setIMarker(index);
  };

  const handleDragEnd = (e) => {
    const newMarkers = JSON.parse(JSON.stringify(markers));
    newMarkers[iMarker].coordinate.latitude = e.coordinate.latitude;
    newMarkers[iMarker].coordinate.longitude = e.coordinate.longitude;
    setMarkers(newMarkers);
  };

  return (
    <View style={styles.container}>
      <Text>MAPS DIRECTION APP</Text>
      <MapView style={styles.mapStyle} initialRegion={region}>
        {markers.map((marker, index) => {
          return (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              draggable
              onDragEnd={({ nativeEvent }) => handleDragEnd(nativeEvent)}
              onDragStart={({ nativeEvent }) => handleDragStart(nativeEvent)}
            >
              <Animated.View style={[styles.markerWrap]}>
                <Animated.View style={[styles.ring]} />
                <View style={styles.marker} />
              </Animated.View>
            </Marker>
          );
        })}
        <Polyline coordinates={routes} strokeWidth={3} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").width,
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});
