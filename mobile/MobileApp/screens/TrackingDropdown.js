import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TrackingDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.button}>
        <Text>Tracking</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text>South Line</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text>North Line</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text>East Line</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: "relative",
  },
  button: {
    padding: 10,
    backgroundColor: "#e85506",
    borderRadius: 4,
  },
  dropdownMenu: {
    position: "absolute",
    top: 40,
    left: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    zIndex: 1000,
  },
  menuItem: {
    padding: 10,
  },
});

export default TrackingDropdown;