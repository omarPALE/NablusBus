import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Card } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

const TicketSection = ({ ticket }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const ticketInfo = {
    departure: ticket?.departure || 'Downtown',
    destination: ticket?.destination || 'Madison',
    class: ticket?.model || 'Standard',
    seatNumber: ticket?.seatNumber || '16B',
    busNumber: ticket?.busNumber || 'A-12345',
    ticketPrice: ticket?.price || '$7',
    departureTime: ticket?.departureTime || '10:00 AM',
    date: ticket?.date || 'September 20, 2024',
    qr_code: ticket?.qr_code || '',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ticket Details</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.header}>Bus Transportation Pass</Text>
          <View style={styles.details}>
            <View style={styles.info}>
              <Text>
                <Text style={styles.label}>Departure:</Text> {ticketInfo.departure}
              </Text>
              <Text>
                <Text style={styles.label}>Destination:</Text> {ticketInfo.destination}
              </Text>
              <Text>
                <Text style={styles.label}>Class:</Text> {ticketInfo.class}
              </Text>
            </View>
            <View style={styles.info}>
              <Text>
                <Text style={styles.label}>Seat Number:</Text> {ticketInfo.seatNumber}
              </Text>
              <Text>
                <Text style={styles.label}>Bus Number:</Text> {ticketInfo.busNumber}
              </Text>
              <Text>
                <Text style={styles.label}>Ticket Price:</Text> {ticketInfo.ticketPrice}
              </Text>
            </View>
            <View style={styles.info}>
              <Text>
                <Text style={styles.label}>Departure Time:</Text> {ticketInfo.departureTime}
              </Text>
              <Text>
                <Text style={styles.label}>Date:</Text> {ticketInfo.date}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.qrButton} onPress={() => setPopupVisible(true)}>
            <Text style={styles.qrButtonText}>QR Code</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Modal visible={isPopupVisible} transparent={true}>
        <View style={styles.popupOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>QR Code for Ticket</Text>
            <QRCode value={ticketInfo.qr_code} size={200} />
            <Text style={styles.popupText}>
              <Text style={styles.label}>Trip Info:</Text> {ticketInfo.departure} to{' '}
              {ticketInfo.destination}, Seat: {ticketInfo.seatNumber}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPopupVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  card: {
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
  },
  qrButton: {
    backgroundColor: '#ff6600',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  qrButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  popupOverlay: {
    flex: 1,
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
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  popupText: {
    marginTop: 16,
  },
  closeButton: {
    backgroundColor: '#ff6600',
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TicketSection;