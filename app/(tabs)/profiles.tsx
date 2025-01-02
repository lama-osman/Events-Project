import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { getProfiles, deleteProfile, updateProfile } from '../services/api';

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await getProfiles();
        setProfiles(response);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const deleteProfileHandler = async (profileId) => {
    try {
      const response = await deleteProfile(profileId);
      if (response.success) {
        setProfiles(profiles.filter(profile => profile.id !== profileId));
        Alert.alert('Profile deleted successfully!');
      } else {
        Alert.alert('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      Alert.alert('Error deleting profile');
    }
  };

  const handleUpdate = async (profileId, updatedData) => {
    console.log(`Update icon pressed for profile id: ${profileId}`);

    try {
      const response = await updateProfile(profileId, updatedData);

      if (!response.ok) {
        throw new Error('Failed to update the profile');
      }

      const data = await response.json();
      console.log('Updated profile:', data);

      setProfiles(profiles.map(profile =>
        profile.id === profileId ? { ...profile, ...updatedData } : profile
      ));

      Alert.alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Failed to update profile. Please try again.');
    }
  };

  const isUpcoming = (eventDate) => {
    const currentDate = new Date();
    const eventDateObj = new Date(eventDate);
    return eventDateObj > currentDate;
  };

  const updatedData = {
    description: 'Updated Description',  // Example data for updating
    event_date: '2025-07-10',  // Example data for updating
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileContainer}>
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <View key={profile.id} style={styles.profileCard}>
              <Text style={styles.profileTitle}>{profile.description}</Text>
              <Text style={styles.profileDate}>
                Event Date: {profile.event_date}
                {'  '}
                <Text style={isUpcoming(profile.event_date) ? styles.upcoming : styles.past}>
                  {isUpcoming(profile.event_date) ? 'Upcoming' : 'Past'}
                </Text>
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleUpdate(profile.id, updatedData)}>
                  <Icon name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteProfileHandler(profile.id)}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text>No profiles found.</Text>
        )}
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
    backgroundColor: '#fff',
  },
  profileContainer: {
    width: '100%',
    maxWidth: 600,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  profileCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileDate: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  upcoming: {
    color: 'green',
    fontWeight: 'bold',
  },
  past: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ProfilesPage;
