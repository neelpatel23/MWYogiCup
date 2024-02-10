import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import InstaStory from 'react-native-insta-story';

const data = [
  {
    user_id: 1,
    // user_image: 'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
    user_name: 'Ahmet Çağlar Durmuş',
    stories: [
      {
        story_id: 1,
        story_image: 'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image: 'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
      },
    ],
  },
  {
    user_id: 2,
    // user_image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    user_name: 'Test User',
    stories: [
      {
        story_id: 1,
        story_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image: 'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
];


const StoryItem = ({ story }) => (
  <View style={styles.storyContainer}>
    {/* <Image source={{ uri: story.story_image }} style={styles.storyImage} /> */}
    {story.swipeText && (
      <View style={styles.swipeTextContainer}>
        <Text style={styles.swipeText}>{story.swipeText}</Text>
      </View>
    )}
  </View>
);

const UserInfo = ({ user }) => (
  <View style={styles.userInfoContainer}>
    {/* <Image source={{ uri: user.user_image }} style={styles.userImage} /> */}
    <Text style={styles.userName}>{user.user_name}</Text>
  </View>
);

const CustomSwipeUpComponent = () => (
  <Button mode="contained" style={styles.customSwipeUp}>
    Swipe Up
  </Button>
);

const CustomCloseComponent = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.customClose}>
    <Text style={styles.customCloseText}>Close</Text>
  </TouchableOpacity>
);

const InstaStoryScreen = () => {
  return (
    <SafeAreaView>
        <InstaStory
            data={data}
            duration={10}
            renderSwipeUpComponent={CustomSwipeUpComponent}
            renderCloseComponent={CustomCloseComponent}
            renderStory={({ user, story, onPress }) => (
                <View style={styles.container}>
                <UserInfo user={user} />
                <StoryItem story={story} />
                <CustomCloseComponent onPress={onPress} />
                </View>
            )}
            />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  swipeTextContainer: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  swipeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  customSwipeUp: {
    backgroundColor: '#4285f4',
    paddingVertical: 10,
    borderRadius: 5,
  },
  customClose: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#4285f4',
    padding: 10,
    borderRadius: 5,
  },
  customCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default InstaStoryScreen;
