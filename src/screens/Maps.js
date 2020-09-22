import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

export default function Maps({ navigation, route }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [iMarker, setIMarker] = useState(null);
  const [iRoute, setIRoute] = useState(0);
  const [markers, setMarkers] = useState([
    {
      coordinate: {
        latitude: 45.5230786,
        longitude: -122.6701034,
      },
      name: "",
      address: "",
    },
    {
      coordinate: {
        latitude: 45.521016,
        longitude: -122.6561917,
      },
      name: "",
      address: "",
    },
  ]);
  const [region, setRegion] = useState(null);
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    if (route.params !== undefined) {
      const newMarkers = JSON.parse(JSON.stringify(markers));
      const { name, coordinate, address } = route.params.place;
      newMarkers[iMarker].coordinate.latitude = coordinate.lat;
      newMarkers[iMarker].coordinate.longitude = coordinate.lng;
      newMarkers[iMarker].name = name;
      newMarkers[iMarker].address = address;
      setMarkers(newMarkers);
    }
  }, [route]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        ...location,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setRegion({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setMarkers([
        {
          coordinate: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
          name: "",
          address: "",
        },
        {
          coordinate: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
          name: "",
          address: "",
        },
      ]);
    })();
  }, []);

  useEffect(() => {
    fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${markers[0].coordinate.latitude}, ${markers[0].coordinate.longitude}&key=[YOURAPIKEY]=${markers[1].coordinate.latitude}, ${markers[1].coordinate.longitude}&mode=walking&alternatives=true`
    )
      .then((resp) => resp.json())
      .then((data) => {
        const routesTemp = data.routes.map((route, i) => {
          const legsTemp = route.legs[0].steps.map((step, i) => {
            return {
              latitude: step.end_location.lat,
              longitude: step.end_location.lng,
            };
          });
          return legsTemp;
        });

        setRoutes(routesTemp);
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

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      {markers.map((marker, i) => {
        return (
          <TouchableOpacity
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setIMarker(i);
              navigation.navigate("Search");
            }}
            key={i}
          >
            <View style={styles.textInput}>
              {i === 0 ? (
                <Text
                  style={{
                    fontSize: 20,
                  }}
                >
                  {marker.name === "" ? "Your Location" : marker.name}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 20,
                  }}
                >
                  {marker.name === "" ? "Your Destination" : marker.name}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
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
        {routes.map((route, i) => {
          return (
            <Polyline
              coordinates={[
                {
                  latitude: markers[0].coordinate.latitude,
                  longitude: markers[0].coordinate.longitude,
                },
                ...route,
              ]}
              strokeWidth={3}
              strokeColor={iRoute === i ? "green" : "red"}
              tappable={true}
              onPress={() => setIRoute(i)}
              key={i}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
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
  textInput: {
    borderWidth: 0.5,
    width: "95%",
    height: 40,
    borderRadius: 18,
    marginBottom: 10,
    paddingLeft: 10,
    justifyContent: "center",
  },
});
