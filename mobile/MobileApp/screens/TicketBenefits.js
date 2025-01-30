import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import * as BarCodeScanner from 'expo-barcode-scanner';

const TicketBenefits = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>What You Get with Each Ticket</Text>
      <View style={styles.benefitsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Multi-Trip Ticket</Text>
            <Text>✔ 30 Rides + 2 Free</Text>
            <Text>✔ Cost-effective for frequent travelers</Text>
            <Text>✔ Valid for 90 days</Text>
            <Text>✔ Easy to track remaining rides</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Single Trip Ticket</Text>
            <Text>✔ One-time use</Text>
            <Text>✔ Best for occasional travelers</Text>
            <Text>✔ Valid for 24 hours from purchase</Text>
            <Text>✔ Instant QR code generation</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Student Ticket</Text>
            <Text>✔ Unlimited rides during the semester</Text>
            <Text>✔ Ideal for students commuting daily</Text>
            <Text>✔ 50% discount for verified student accounts</Text>
            <Text>✔ Full access to bus network</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  benefitsContainer: {
    gap: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default TicketBenefits;