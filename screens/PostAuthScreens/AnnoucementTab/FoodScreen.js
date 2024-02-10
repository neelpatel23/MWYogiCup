import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';

const FoodItem = ({ mealType, mealName }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{mealType}</Text>
    <Text style={styles.cardText}>{mealName}</Text>
  </View>
);

const FoodMenuScreen = () => {
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const days = ['Day 1', 'Day 2', 'Day 3'];
        const menuData = [];

        for (const day of days) {
          const docRef = doc(database, 'foodMenuDATA', day);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const dayData = docSnap.data();
            if (dayData && dayData.meals) {
              const mealsArray = Object.entries(dayData.meals).map(([type, name]) => ({ type, name }));
              menuData.push({ day, meals: mealsArray });
            }
          }
        }

        setFoodMenu(menuData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching food data:', error);
        setLoading(false);
      }
    };

    fetchFoodData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {foodMenu.map((dayData, index) => (
        <View key={index}>
          <Text style={styles.dayTitle}>{dayData.day}</Text>
          {dayData.meals && Array.isArray(dayData.meals) ? (
            ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'].map((mealType) => {
              const meal = dayData.meals.find((m) => m.type === mealType);
              return meal ? (
                <FoodItem key={mealType} mealType={meal.type} mealName={meal.name} />
              ) : null;
            })
          ) : (
            <Text>No meals found for this day.</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5'
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  cardText: {
    fontSize: 14,
    color: '#555'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default FoodMenuScreen;
