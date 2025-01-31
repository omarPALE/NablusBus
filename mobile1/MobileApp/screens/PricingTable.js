import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, RadioButton } from 'react-native-paper';
import TicketPopUp from './TicketPopUp';

const PricingTable = ({ route, navigation }) => {
  console.log('route.params in PricingTable:', route.params);
  const { userState } = route.params; // Access userState from route.params

  const [pricingData, setPricingData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMsgPopupOpen, setIsMsgPopupOpen] = useState(false);
  const [ticketData, setTicketData] = useState({
    userName: userState?.username || 'Guest', // Use userState.username
    ticketType: '',
    model: '',
    rides_left: 0,
    qr_code: '123',
    price: 3,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          qr_code: '1234567890',
          title: 'Multi Trip',
          model: 'multi',
          price: 30,
          TicketType: 'Half or Full',
          rides_left: 10,
          touched: false,
        },
        {
          id: 2,
          qr_code: '1234567890',
          title: 'Single Trip',
          model: 'single',
          price: 3,
          TicketType: 'Half or Full',
          rides_left: 1,
          touched: false,
        },
        {
          id: 3,
          qr_code: '',
          title: 'Student',
          model: 'package',
          price: 299.99,
          TicketType: 'full',
          rides_left: 100,
          touched: false,
        },
      ];
      setPricingData(data);
    };

    fetchData();
  }, []);

  const handleCreateTicket = (id) => {
    if (!userState.loggedIn) {
      setIsMsgPopupOpen(true);
      setTimeout(() => {
        setIsMsgPopupOpen(false);
        navigation.navigate('Login');
      }, 1500);
    } else {
      setPricingData((prevData) =>
        prevData.map((ticket) =>
          ticket.id === id ? { ...ticket, touched: true } : { ...ticket, touched: false }
        )
      );
      setIsPopupOpen(true);
    }
  };

  const handleTicketTypeChange = (id, value) => {
    setPricingData((prevData) =>
      prevData.map((ticket) =>
        ticket.id === id ? { ...ticket, ticketType: value } : ticket
      )
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Bus Ticket Pricing</Text>
      {pricingData.map((plan) => (
        <Card key={plan.id} style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>{plan.title}</Text>
            <Text style={styles.price}>
              NIS {Math.floor(plan.price)}.{Math.round((plan.price % 1) * 100)} / Trip
            </Text>
            <View style={styles.radioGroup}>
              <RadioButton.Group
                onValueChange={(value) => handleTicketTypeChange(plan.id, value)}
                value={plan.ticketType}
              >
                <View style={styles.radioButton}>
                  <Text>Half</Text>
                  <RadioButton value="half" />
                </View>
                <View style={styles.radioButton}>
                  <Text>Full</Text>
                  <RadioButton value="full" />
                </View>
              </RadioButton.Group>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCreateTicket(plan.id)}
            >
              <Text style={styles.buttonText}>Create Ticket</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      ))}

      {isPopupOpen && (
        <TicketPopUp
          setIsPopupOpen={setIsPopupOpen}
          ticketData={ticketData}
          userState={userState}
          setTicketData={setTicketData}
          pricingData={pricingData}
          qr_code={qrCode}
          setQRcode={setQRcode}
        />
      )}

      {isMsgPopupOpen && (
        <View style={styles.popupOverlay}>
          <View style={styles.popupContent}>
            <Text>You need to sign in to create a ticket!</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff6600',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
});

export default PricingTable;