import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Image } from 'react-native';
import { getDetails } from '../services/api'; // Make sure you have the API call to fetch details

const HomeScreen = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getDetails(); // This function will fetch the data
        setDetails(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching details:', error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  // Group the details by type (flowers, food, etc.)
  const groupedDetails = details.reduce((groups, item) => {
    const type = item.type || 'Other'; // Use 'type' for categorization
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {});

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        Object.keys(groupedDetails).map((type, index) => (
          <View key={type} style={styles.section}>
            {/* Section title */}
            <Text style={styles.sectionTitle}>{type}</Text>

            {/* List of items in each section */}
            <FlatList
              data={groupedDetails[type]}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemCard}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text>{item.description}</Text>

                  {/* Render the image */}
                  {item.image ? (
                    <Image
                      source={{ uri: `http://127.0.0.1:8000${item.image}` }} // Dynamically set image URL
                      style={styles.itemImage}
                    />
                  ) : (
                    <Text>No image available</Text>
                  )}
                </View>
              )}
            />

            {/* Add divider line between sections */}
            {index < Object.keys(groupedDetails).length - 1 && (
              <View
                style={{
                  width: '100%', // Ensure it spans the entire width
                  borderBottomColor: 'black',
                  borderBottomWidth: 1, // Ensure thickness
                  marginVertical: 10, // Add space around the line
                }}
              />
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // Add paddingTop for spacing from the top if needed
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22, // Increased size for better visibility
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  itemCard: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginTop: 10,
  },
});

export default HomeScreen;
