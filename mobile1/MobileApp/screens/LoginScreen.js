import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LoginScreen = ({ setUserState }) => {
  const navigation = useNavigation();

  // State to manage login information, errors, and "Remember Me"
  const [signInInfo, setSignInInfo] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load user from localStorage or sessionStorage (if using AsyncStorage)
  useEffect(() => {
    const loadUser = async () => {
      // You can use AsyncStorage or another storage solution for mobile
      const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUserState({
          loggedIn: true,
          email: userData.email,
          username: userData.username,
          user_id: userData.id,
          role: userData.role,
          work_id: userData.work_id,
        });
        navigation.navigate('Home');
      }
    };

    loadUser();
  }, [navigation, setUserState]);

  const handleEmailChange = (text) => {
    setSignInInfo((prevState) => ({
      ...prevState,
      email: text,
    }));
    setError('');
    setIsEmailInvalid(false);
  };

  const handlePasswordChange = (text) => {
    setSignInInfo((prevState) => ({
      ...prevState,
      password: text,
    }));
    setError('');
    setIsPasswordInvalid(false);
  };

  const handleRememberMeChange = () => {
    setRememberMe((prev) => !prev);
  };

  const handleLogIn = async () => {
    try {
      const response = await axios.post('http://localhost:5000/users/email', {
        email: signInInfo.email,
        password: signInInfo.password,
      });

      if (response.status === 200) {
        const { email, username, id, role, work_id } = response.data;
        const userData = { email, username, id, role, work_id };

        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('user', JSON.stringify(userData));
        }

        setUserState({
          loggedIn: true,
          email,
          username,
          user_id: id,
          role,
          work_id,
        });

        navigation.navigate('Home');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Incorrect password. Please try again.');
        setIsPasswordInvalid(true);
      } else if (err.response?.status === 404) {
        setError('User not found. Please sign up.');
        setIsEmailInvalid(true);
      } else {
        setError('An error occurred. Please try again later.');
        console.error('An error occurred:', err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>Login</Text>
      </View>

      {/* Login Form */}
      <View style={styles.content}>
        <TextInput
          style={[styles.input, isEmailInvalid && styles.errorInput]}
          placeholder="Email"
          value={signInInfo.email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, isPasswordInvalid && styles.errorInput]}
          placeholder="Password"
          value={signInInfo.password}
          onChangeText={handlePasswordChange}
          secureTextEntry
        />

        <View style={styles.rememberMeContainer}>
          <TouchableOpacity onPress={handleRememberMeChange} style={styles.checkbox}>
            <View style={[styles.checkboxBox, rememberMe && styles.checkedBox]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogIn}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorInput: {
    borderColor: 'red',
    backgroundColor: '#ffe6e6',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedBox: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
  },
  rememberMeText: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});

export default LoginScreen;