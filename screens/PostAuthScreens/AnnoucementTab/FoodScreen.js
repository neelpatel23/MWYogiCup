import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { database } from '../../../config/firebase';
import colors from '../../../globalVariables/colors';

// Updated FoodItem component to handle meal names with commas as bullet-pointed lists
const FoodItem = ({ mealType, mealName }) => {
  const mealComponents = mealName.includes(',') ? mealName.split(',').map(item => item.trim()) : [mealName];
  
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{mealType}</Text>
      {mealComponents.length > 1 ? (
        mealComponents.map((item, index) => (
          <Text key={index} style={styles.cardText}>• {item}</Text>
        ))
      ) : (
        <Text style={styles.cardText}>{mealName}</Text>
      )}
    </View>
  );
};

const FoodMenuScreen = () => {
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const q = query(collection(database, 'foodMenuDATA'), orderBy('id'));
        const querySnapshot = await getDocs(q);
        const menuData = [];

        querySnapshot.forEach((doc) => {
          const dayData = doc.data();
          if (dayData && dayData.meals) {
            const mealsArray = Object.entries(dayData.meals)
              .map(([type, name]) => ({ type, name }))
              .sort((a, b) => a.type.localeCompare(b.type)); // This might not be necessary if meal types are consistent and the desired order is handled below
            menuData.push({ day: doc.id, meals: mealsArray });
          }
        });

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

  const mealOrder = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];

  return (
    <ScrollView style={styles.container}>
      {foodMenu.map((dayData, index) => (
        <View key={index}>
          <Text style={styles.dayTitle}>{dayData.day}</Text>
          {dayData.meals && Array.isArray(dayData.meals) ? (
            mealOrder.map((mealType, idx) => {
              const meal = dayData.meals.find((m) => m.type === mealType);
              return meal ? (
                <FoodItem key={`${mealType}-${idx}`} mealType={meal.type} mealName={meal.name} />
              ) : null;
            })
          ) : (
            <Text style={styles.noMealsText}>No meals found for this day.</Text>
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
    backgroundColor: colors.yogiCupBlue,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  card: {
    width: '100%',
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  noMealsText: {
    fontSize: 14,
    color: 'white',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.yogiCupBlue,
  },
});

export default FoodMenuScreen;
