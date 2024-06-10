import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import InstaStory from 'react-native-insta-story';
import { AuthContext } from '../AuthContext';
import axios from 'axios'


const ProfileScreen = () => {

  const {userId} = useContext(AuthContext)
  const channels = [
    {
      id: '0',
      name: 'Netflix',
      image: 'data:image/png;base64,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',
      text: 'Your in the right place',
      date: '2:45 AM',
    },
    {
      id: '2',
      name: 'Marc Zuckerberg',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHtsQvDUZ3Q90XuFjYvcZ-KVaDhUJcA39u-g&s',
      text: 'Anyone else watching this weekend?',
      date: '2:45 AM',
    },
    {
      id: '0',
      name: 'Indian Cricket Team',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAtic4zkoYA0BmKDTREcuxL0VWVMlP3UqBUg&s',
      text: 'Any guesses who won the Fielding medal for the series',
      date: '1:45 PM',
    },
    {
      id: '3',
      name: 'Cravings',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPcBoRdfwpZXICr6FFLcUDT4c22xCzTVwQj6e9lwQHTo-KZw12rZD_z4u-_595SK_EpU8&usqp=CAU',
      text: 'Fruit Platters are the best',
      date: '2:45 AM',
    },
    {
      id: '5',
      name: 'Royal Challengers Bangalore',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDlVuzjh0-kKm1BbO5qBjeIwelK8r4DvYZ5A&s',
      text: 'We only want it to rain boundaries and wickets for RCB',
      date: '2:45 AM',
    },
  ];
  const data = [
    {
      user_id: 1,
      user_image:
        'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
      user_name: 'Ahmet Çağlar Durmuş',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
        },
      ],
    },
    {
      user_id: 2,
      user_image:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      user_name: 'Test User',
      stories: [
        {
          story_id: 1,
          story_image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
        },
        {
          story_id: 2,
          story_image:
            'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 2 swiped'),
        },
      ],
    },
  ];


  const [profileImage,setProfileImage] = useState("")


  const getUser = async() =>{
    try {
      const response = await axios.get(`http://192.168.1.4:8000/getUser/${userId}`);
      setProfileImage(response.data.image)
    } catch (error) {
      console.log('Error', error);
    }
  }

   useEffect(()=>{
     getUser()
   },[])

  return (
    <SafeAreaView>
      <View style={{padding: 10}}>
        <Text style={{fontSize: 17, fontWeight: 'bold' }}>Updates</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10,
          }}>
          <View style={{marginTop: 10}}>
            <Pressable>
              <Image
                style={{width: 58, height: 58, borderRadius: 29}}
                source={{
                  uri: profileImage || 'https://lh3.googleusercontent.com/ogw/AF2bZyi09EC0vkA0pKVqrtBq0Y-SLxZc0ynGmNrVKjvV66i3Yg=s64-c-mo',
                }}
              />
              <Text style={{textAlign: 'center', marginTop: 5}}>My Update</Text>
            </Pressable>
          </View>
          <InstaStory data={data} duration={10} />
        </View>
      </View>

      <View style={{padding: 10}}>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>Channels</Text>
        {channels?.map((item, index) => (
          <View key={item?._id}
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}>
            <View>
              <Image
                style={{width: 50, height: 50, borderRadius: 25}}
                source={{uri: item?.image}}
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                {item?.name}
              </Text>
              <Text style={{marginTop: 4, color: 'gray'}}>{item?.text}</Text>
            </View>

            <Text>{item?.date}</Text>
          </View>
        ))}

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Image
            style={{width: 120, height: 120}}
            source={{
              uri: 'https://signal.org/assets/images/features/Stickers.png',
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});