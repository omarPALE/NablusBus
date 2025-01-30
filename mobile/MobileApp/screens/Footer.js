import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For icons

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      {/* About Us Section */}
      <View style={styles.footerSection}>
        <Text style={styles.footerTitle}>About Us</Text>
        <Text style={styles.footerText}>
          Welcome to our company! We strive to deliver the best products and
          services. Our mission is to bring innovation and quality to your
          doorstep.
        </Text>
      </View>

      {/* Our Services Section */}
      <View style={styles.footerSection}>
        <Text style={styles.footerTitle}>Our Services</Text>
        <View style={styles.footerList}>
          <TouchableOpacity onPress={() => Linking.openURL('#!')}>
            <Text style={styles.footerLink}>Web Development</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('#!')}>
            <Text style={styles.footerLink}>Mobile Apps</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('#!')}>
            <Text style={styles.footerLink}>E-commerce Solutions</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('#!')}>
            <Text style={styles.footerLink}>SEO Optimization</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Links Section */}
      <View style={styles.footerSection}>
        <Text style={styles.footerTitle}>Quick Links</Text>
        <View style={styles.footerList}>
          <TouchableOpacity onPress={() => Linking.openURL('#!')}>
            <Text style={styles.footerLink}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('#!')}>
            <Text style={styles.footerLink}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('#!')}>
            <Text style={styles.footerLink}>FAQs</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('#!')}>
            <Text style={styles.footerLink}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact Us Section */}
      <View style={styles.footerSection}>
        <Text style={styles.footerTitle}>Contact Us</Text>
        <Text style={styles.footerText}>
          <FontAwesome name="home" size={16} /> 123 Business Street, City Name, Country
        </Text>
        <Text style={styles.footerText}>
          <FontAwesome name="envelope" size={16} /> support@company.com
        </Text>
        <Text style={styles.footerText}>
          <FontAwesome name="phone" size={16} /> +123 456 7890
        </Text>
        <Text style={styles.footerText}>
          <FontAwesome name="print" size={16} /> +123 456 7891
        </Text>
      </View>

      {/* Social Media Section */}
      <View style={[styles.footerSection, styles.footerSocials]}>
        <TouchableOpacity onPress={() => Linking.openURL('#!')}>
          <FontAwesome name="facebook" size={24} style={styles.socialLink} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('#!')}>
          <FontAwesome name="twitter" size={24} style={styles.socialLink} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('#!')}>
          <FontAwesome name="google" size={24} style={styles.socialLink} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('#!')}>
          <FontAwesome name="instagram" size={24} style={styles.socialLink} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#ff6600',
    padding: 20,
  },
  footerSection: {
    marginBottom: 20,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  footerList: {
    marginLeft: 10,
  },
  footerLink: {
    fontSize: 14,
    marginBottom: 8,
    color: '#000',
  },
  footerSocials: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  socialLink: {
    color: '#000',
  },
});

export default Footer;