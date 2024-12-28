import React, { useState } from "react";
import { ScrollView } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Switch,
} from "react-native";

const SubscriptionScreen = () => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for fade animation
  const [planSwitchStates, setPlanSwitchStates] = useState({}); // State for switch values

  React.useEffect(() => {
    // Trigger animation on component mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const plans = [
    {
      id: 1,
      title: "Basic Plan",
      price: "$9.99",
      features: ["Feature 1", "Feature 2", "Feature 3"],
    },
    {
      id: 2,
      title: "Standard Plan",
      price: "$19.99",
      features: ["Feature A", "Feature B", "Feature C"],
    },
    {
      id: 3,
      title: "Premium Plan",
      price: "$29.99",
      features: ["Feature X", "Feature Y", "Feature Z"],
    },
  ];

  const handleSwitchToggle = (planId, value) => {
    setPlanSwitchStates((prevState) => ({
      ...prevState,
      [planId]: value,
    }));
  };

  const renderPlan = (plan) => (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]} key={plan.id}>
      <Text style={styles.title}>{plan.title}</Text>
      <Text style={styles.price}>{plan.price}</Text>
      {plan.features.map((feature, index) => (
        <Text key={index} style={styles.feature}>
          {feature}
        </Text>
      ))}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Half</Text>
        <Switch
          value={planSwitchStates[plan.id] || false}
          onValueChange={(value) => handleSwitchToggle(plan.id, value)}
        />
        <Text style={styles.switchLabel}>Full</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Subscribe</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Choose Your Subscription</Text>
        <View style={styles.plansContainer}>{plans.map(renderPlan)}</View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  plansContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: "#ff6000",
    marginBottom: 10,
  },
  feature: {
    fontSize: 16,
    color: "#555",
    marginVertical: 2,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "60%",
  },
  switchLabel: {
    fontSize: 16,
    color: "#555",
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ff6000",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SubscriptionScreen;
