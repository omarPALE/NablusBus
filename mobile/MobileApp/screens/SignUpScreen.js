import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Footer from '../screens/Footer';

const SignUpScreen = ({ setUserState }) => {
  const navigation = useNavigation();

  // State to manage form values and errors
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    userType: 'Passenger',
    workId: '',
    date: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Refs for form inputs
  const formRefs = useRef({
    firstName: null,
    lastName: null,
    workId: null,
    date: null,
    phone: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  // Validation functions
  const isRequired = (value) => (value === '' ? false : true);
  const isBetween = (length, min, max) => length >= min && length <= max;
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone) => /^(056|059)\d{7}$/.test(phone);
  const isPasswordSecure = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password);
  const isWorkIdValid = (workId) => /^\d{5}$/.test(workId);

  // Show error message
  const showError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  // Clear error message
  const showSuccess = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Validate form fields
  const validateField = (field, value) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!isRequired(value)) {
          showError(field, `${field === 'firstName' ? 'First Name' : 'Last Name'} cannot be blank.`);
        } else if (!isBetween(value.length, 3, 25)) {
          showError(field, `${field === 'firstName' ? 'First Name' : 'Last Name'} must be between 3 and 25 characters.`);
        } else {
          showSuccess(field);
        }
        break;

      case 'email':
        if (!isRequired(value)) {
          showError(field, 'Email cannot be blank.');
        } else if (!isEmailValid(value)) {
          showError(field, 'Email is not valid.');
        } else {
          showSuccess(field);
        }
        break;

      case 'phone':
        if (!isRequired(value)) {
          showError(field, 'Phone cannot be blank.');
        } else if (!isPhoneValid(value)) {
          showError(field, 'Phone is not valid.');
        } else {
          showSuccess(field);
        }
        break;

      case 'password':
        if (!isRequired(value)) {
          showError(field, 'Password cannot be blank.');
        } else if (!isPasswordSecure(value)) {
          showError(
            field,
            'Password must have at least 8 characters, including 1 lowercase, 1 uppercase, 1 number, and 1 special character.'
          );
        } else {
          showSuccess(field);
        }
        break;

      case 'confirmPassword':
        if (!isRequired(value)) {
          showError(field, 'Please confirm your password.');
        } else if (value !== values.password) {
          showError(field, 'Passwords do not match.');
        } else {
          showSuccess(field);
        }
        break;

      case 'workId':
        if (values.userType === 'Driver' && !isWorkIdValid(value)) {
          showError(field, 'Work ID must be a 5-digit number.');
        } else {
          showSuccess(field);
        }
        break;

      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all fields
    Object.keys(values).forEach((field) => validateField(field, values[field]));

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== '')) {
      Alert.alert('Error', 'Please fix the errors in the form.');
      return;
    }

    try {
      const formData = {
        username: `${values.firstName} ${values.lastName}`,
        phone: values.phone,
        email: values.email,
        password: values.password,
        work_id: values.workId,
        role: values.userType.toLowerCase(),
      };

      const response = await axios.post('http://localhost:5000/users/add', formData);

      if (response.status === 200) {
        setUserState({
          loggedIn: true,
          email: values.email,
          username: `${values.firstName} ${values.lastName}`,
          role: values.userType.toLowerCase(),
        });

        navigation.navigate('Home');
      }
    } catch (err) {
      if (err.response?.data) {
        Alert.alert('Error', 'This username or email is already in use. Please try another.');
      } else {
        Alert.alert('Error', 'An error occurred. Please try again later.');
      }
      console.error(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* First Name */}
      <TextInput
        style={[styles.input, errors.firstName && styles.errorInput]}
        placeholder="First Name"
        value={values.firstName}
        onChangeText={(text) => {
          setValues((prev) => ({ ...prev, firstName: text }));
          validateField('firstName', text);
        }}
        ref={(el) => (formRefs.current.firstName = el)}
      />
      {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

      {/* Last Name */}
      <TextInput
        style={[styles.input, errors.lastName && styles.errorInput]}
        placeholder="Last Name"
        value={values.lastName}
        onChangeText={(text) => {
          setValues((prev) => ({ ...prev, lastName: text }));
          validateField('lastName', text);
        }}
        ref={(el) => (formRefs.current.lastName = el)}
      />
      {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

      {/* User Type */}
      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeTitle}>Select User Type:</Text>
        <View style={styles.userTypeOptions}>
          <TouchableOpacity
            style={[styles.userTypeButton, values.userType === 'Passenger' && styles.selectedButton]}
            onPress={() => setValues((prev) => ({ ...prev, userType: 'Passenger', workId: '' }))}
          >
            <Text style={styles.userTypeText}>Passenger</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.userTypeButton, values.userType === 'Driver' && styles.selectedButton]}
            onPress={() => setValues((prev) => ({ ...prev, userType: 'Driver' }))}
          >
            <Text style={styles.userTypeText}>Driver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.userTypeButton, values.userType === 'Administrator' && styles.selectedButton]}
            onPress={() => setValues((prev) => ({ ...prev, userType: 'Administrator', workId: '' }))}
          >
            <Text style={styles.userTypeText}>Administrator</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Work ID (for Drivers) */}
      {values.userType === 'Driver' && (
        <TextInput
          style={[styles.input, errors.workId && styles.errorInput]}
          placeholder="Work ID"
          value={values.workId}
          onChangeText={(text) => {
            setValues((prev) => ({ ...prev, workId: text }));
            validateField('workId', text);
          }}
          ref={(el) => (formRefs.current.workId = el)}
        />
      )}
      {errors.workId && <Text style={styles.errorText}>{errors.workId}</Text>}

      {/* Birth Date */}
      <TextInput
        style={[styles.input, errors.date && styles.errorInput]}
        placeholder="Birth Date"
        value={values.date}
        onChangeText={(text) => {
          setValues((prev) => ({ ...prev, date: text }));
          validateField('date', text);
        }}
        ref={(el) => (formRefs.current.date = el)}
      />
      {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

      {/* Phone Number */}
      <TextInput
        style={[styles.input, errors.phone && styles.errorInput]}
        placeholder="Phone Number"
        value={values.phone}
        onChangeText={(text) => {
          setValues((prev) => ({ ...prev, phone: text }));
          validateField('phone', text);
        }}
        ref={(el) => (formRefs.current.phone = el)}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      {/* Email */}
      <TextInput
        style={[styles.input, errors.email && styles.errorInput]}
        placeholder="Email"
        value={values.email}
        onChangeText={(text) => {
          setValues((prev) => ({ ...prev, email: text }));
          validateField('email', text);
        }}
        ref={(el) => (formRefs.current.email = el)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Password */}
      <TextInput
        style={[styles.input, errors.password && styles.errorInput]}
        placeholder="Password"
        value={values.password}
        onChangeText={(text) => {
          setValues((prev) => ({ ...prev, password: text }));
          validateField('password', text);
        }}
        secureTextEntry={!showPassword}
        ref={(el) => (formRefs.current.password = el)}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Confirm Password */}
      <TextInput
        style={[styles.input, errors.confirmPassword && styles.errorInput]}
        placeholder="Confirm Password"
        value={values.confirmPassword}
        onChangeText={(text) => {
          setValues((prev) => ({ ...prev, confirmPassword: text }));
          validateField('confirmPassword', text);
        }}
        secureTextEntry={!showConfirmPassword}
        ref={(el) => (formRefs.current.confirmPassword = el)}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      {/* Show/Hide Password Toggle */}
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.toggleText}>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
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
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  userTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  userTypeText: {
    color: '#000',
  },
  toggleText: {
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007bff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;