import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { getDetails, createProfile } from '../services/api';

const NewProfilePage = () => {
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [people, setPeople] = useState('');
  const [theme, setTheme] = useState('');
  const [details, setDetails] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getDetails();
        setDetails(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching details:', error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleSubmit = async () => {
    const profileData = {
      event_date: eventDate,
      description,
      people: parseInt(people),
      theme,
      details: selectedDetails,
    };

    try {
      await createProfile(profileData);
      alert('Profile created successfully!');
      // Reset form
      setEventDate('');
      setDescription('');
      setPeople('');
      setTheme('');
      setSelectedDetails([]);
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Make your event special</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event date (YYYY-MM-DD)"
            value={eventDate}
            onChangeText={setEventDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of People</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of people"
            keyboardType="numeric"
            value={people}
            onChangeText={setPeople}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Theme</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event theme"
            value={theme}
            onChangeText={setTheme}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Details</Text>
          {loading ? (
            <Text>Loading details...</Text>
          ) : (
            <MultiSelect
              items={details.map((detail) => ({ id: detail.id, name: detail.title }))}
              uniqueKey="id"
              onSelectedItemsChange={setSelectedDetails}
              selectedItems={selectedDetails}
              selectText="Pick Details"
              searchInputPlaceholderText="Search Details..."
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#000"
              selectedItemTextColor="#000"
              selectedItemIconColor="#000"
              itemTextColor="#000"
              displayKey="name" // Display the name (title) of each detail
              searchInputStyle={{ color: '#000' }}
              styleDropdownMenuSubsection={styles.dropdown}
            />
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    padding: 10,
    backgroundColor: '#fff'
  },
  formContainer: {
    width: '100%',
    maxWidth: 600,
    padding: 10,
    paddingTop: 20, // Add padding at the top
    paddingBottom: 20, // Add padding at the bottom
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#87ceeb',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#87ceeb',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NewProfilePage;
