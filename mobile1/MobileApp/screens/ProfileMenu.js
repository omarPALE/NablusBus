import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileMenu = ({ avatar, name, email, setUserState, navigation }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const logOut = () => {
    setUserState({
      loggedIn: false,
      email: '',
      username: '',
    });
    console.log('userState in ProfileMenu:', userState);
    navigation.navigate('Login'); // Navigate to the login screen
  };

  return (
    <View style={styles.profileMenuContainer}>
      {/* Profile Icon */}
      <TouchableOpacity onPress={toggleDropdown} style={styles.profileIcon}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.placeholderText}>
              {name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Dropdown Menu */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDropdown(false)}>
          <View style={styles.dropdownMenu}>
            {/* User Info */}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{name || 'Guest'}</Text>
              <Text style={styles.userEmail}>{email || 'guest@example.com'}</Text>
            </View>
            <View style={styles.divider} />

            {/* Dropdown Items */}
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => navigation.navigate('TicketBenefits')}
            >
              <Text style={styles.dropdownItemText}>Ticket Benefits</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => navigation.navigate('PricingTable', { userState })}
            >
              <Text style={styles.dropdownItemText}>Pricing Table</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => navigation.navigate('TicketSection')}
            >
              <Text style={styles.dropdownItemText}>Ticket Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={logOut}>
              <Text style={styles.dropdownItemText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  profileMenuContainer: {
    position: 'relative',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6600', // Changed to orange
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // Changed to white for better contrast with orange
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownMenu: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  userInfo: {
    paddingVertical: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#555',
  },
});

export default ProfileMenu;