import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import _ from "lodash";

export default ({ navigation }) => {
  const [places, setPlaces] = useState([]);

  const onSetPlace = _.debounce((value) => {
    fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?input=${value}&inputtype=textquery&key=[YOURAPIKEY]`
    )
      .then((resp) => resp.json())
      .then((data) => {
        setPlaces(data.results);
      });
  }, 500);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <TextInput
          style={styles.inputText}
          placeholder="Search Destination"
          onChangeText={(text) => onSetPlace(text)}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {places.map((placeItem, i) => {
          return (
            <TouchableOpacity
              style={styles.list}
              key={i}
              onPress={() => {
                navigation.navigate("Maps", {
                  place: {
                    coordinate: placeItem.geometry.location,
                    name: placeItem.name,
                    address: placeItem.formatted_address,
                  },
                });
              }}
            >
              <Text style={styles.listItem}>{placeItem.name}</Text>
              <Text style={styles.listItem2}>
                {placeItem.formatted_address}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    marginTop: 60,
  },
  text: {
    fontSize: 42,
  },
  inputText: {
    borderWidth: 0.5,
    width: "95%",
    height: 40,
    borderRadius: 18,
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    position: "absolute",
    zIndex: 99,
    backgroundColor: "white",
  },
  list: {
    // flexDirection: "row",
    borderBottomWidth: 0.5,
    padding: 10,
    // justifyContent: "space-between",
  },
  listItem: {
    fontSize: 18,
    // width: windowWidth / 3,
  },
  listItem2: {
    fontSize: 13,
    // width: windowWidth / 3,
  },
});
