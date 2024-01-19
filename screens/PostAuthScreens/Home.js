import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, Card, Title, Paragraph } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({ userDisplayName, navigation }) => {
    const handleAccountPress = () => {
        // Navigation logic to account page
        console.log('Navigate to Account Page');
        // navigation.navigate('AccountPage'); // Uncomment and use your navigation logic
    };

    return (
        <View style={styles.container}>
            {/* <Appbar.Header>
                <Appbar.Content title={`Jay Swaminarayan, ${userDisplayName} bhai`} />
                <Appbar.Action icon="account-circle" onPress={handleAccountPress} />
            </Appbar.Header> */}

            <ScrollView style={styles.scrollView}>
                <View style={styles.section}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title>Upcoming Games</Title>
                            <Paragraph>Check out the schedule for the next exciting matches!</Paragraph>
                        </Card.Content>
                        <Card.Cover source={{ uri: 'https://example.com/game-schedule-image.jpg' }} />
                    </Card>
                </View>

                <View style={styles.section}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title>Leaderboard</Title>
                            <Paragraph>See who's leading in the tournament right now!</Paragraph>
                        </Card.Content>
                        <Card.Cover source={{ uri: 'https://example.com/leaderboard-image.jpg' }} />
                    </Card>
                </View>

                <View style={styles.section}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title>Latest News</Title>
                            <Paragraph>Stay updated with the latest news and updates from the tournament.</Paragraph>
                        </Card.Content>
                    </Card>
                </View>

                <TouchableOpacity 
                    style={styles.rulesButton}
                    onPress={() => signOut(auth)}>
                    <Text style={styles.rulesButtonText}>Tournament Rules & FAQs</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        margin: 10,
    },
    section: {
        marginBottom: 20,
    },
    card: {
        elevation: 4,
    },
    rulesButton: {
        backgroundColor: '#4a90e2',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    rulesButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Home;
