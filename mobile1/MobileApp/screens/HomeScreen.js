import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Animated, Linking, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For icons
import ProfileMenu from '../screens/ProfileMenu';
import GoogleMaps from '../screens/GoogleMap';

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade animation

  // State for user information
  const [userState, setUserState] = useState({
    loggedIn: true,
    email: 'user@example.com',
    username: 'John Doe',
  });

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Footer Component
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

  return (
    <View style={styles.container}>
      {/* Profile Menu */}
      <View style={styles.profileMenuContainer}>
        <ProfileMenu
          avatar="https://via.placeholder.com/150" // Replace with your image URL
          name={userState.username}
          email={userState.email}
          setUserState={setUserState}
          navigation={navigation} // Pass the navigation prop
          userState={userState}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Image */}
        <Image source={require('../assets/home.jpg')} style={styles.headerImage} />

        {/* Content Sections */}
        <Animated.View style={[styles.contentHolder, { opacity: fadeAnim }]}>
          <Text style={styles.contentTitle}>تجربة تنقل مميزة</Text>
          <Text style={styles.contentDescription}>
            اتنقل وانت مرتاح وما تهمل هم الجو 🚌✅ باصات حديثة ومكيفة بالإضافة إلى الراحة الي بتوفرلكم اياها
          </Text>
          <TouchableOpacity
            style={styles.contentButton}
            onPress={() => navigation.navigate('TicketBenefits')}
          >
            <Text style={styles.buttonText}>تعرف علينا</Text>
          </TouchableOpacity>
          <Image source={require('../assets/markiting.jpg')} style={styles.contentImage} />
        </Animated.View>

        <Animated.View style={[styles.contentHolder, { opacity: fadeAnim }]}>
          <Image source={require('../assets/jamua.jpg')} style={styles.contentImage} />
          <Text style={styles.contentTitle}>خدمات طلابية</Text>
          <Text style={styles.contentDescription}>
            لكل طالب ما بحب يضيع وقته وهو يستنى👍 شركة باصات نابلس الكبرى وفرتلكم باصات نقل مريحة ومكيفة من البلد حتى جامعة النجاح القديمة والأكاديمية والعكس 🔄
          </Text>
          <TouchableOpacity
            style={styles.contentButton}
            onPress={() => navigation.navigate('PricingTable')}
          >
            <Text style={styles.buttonText}>مواعيد الرحلات</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.contentHolder, { opacity: fadeAnim }]}>
          <Text style={styles.contentTitle}>خدمات لجميع الفئات</Text>
          <Text style={styles.contentDescription}>
            باصات نابلس الكبرى تقدم "بطاقة وقار"، مبادرة حصرية لتكريم كبار السن
          </Text>
          <TouchableOpacity
            style={styles.contentButton}
            onPress={() => navigation.navigate('TicketSection')}
          >
            <Text style={styles.buttonText}>اطلب بطاقتك</Text>
          </TouchableOpacity>
          <Image source={require('../assets/waqar.jpg')} style={styles.contentImage} />
        </Animated.View>

        {/* Map Tracking Button */}
        <Animated.View style={[styles.contentHolder, { opacity: fadeAnim }]}>
          <Text style={styles.contentTitle}>تتبع الباصات</Text>
          <Text style={styles.contentDescription}>
            تتبع الباصات في الوقت الحقيقي باستخدام خرائط جوجل.
          </Text>
          <TouchableOpacity
            style={styles.contentButton}
            onPress={() => navigation.navigate('MapTracking')}
          >
            <Text style={styles.buttonText}>تتبع الآن</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e6e6', // Background color from CSS
  },
  profileMenuContainer: {
    position: 'absolute',
    top: 40, // Adjust based on your header height
    right: 16,
    zIndex: 1000, // Ensure it's above other content
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 100, // Add padding to avoid overlap with the profile menu
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  contentHolder: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
  },
  contentDescription: {
    fontSize: 16,
    textAlign: 'right',
    lineHeight: 24,
    marginBottom: 20,
  },
  contentButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
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

export default HomeScreen;