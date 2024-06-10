import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatsScreen from '../screens/ChatsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PeopleScreen from '../screens/PeopleScreen';
import ProfileScreen from '../screens/ProfileScreen'
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../AuthContext';
import RequestChatRoom from '../screens/RequestChatRoom';
import ChatRoom from '../screens/ChatRoom';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const {token,setToken}= useContext(AuthContext);
  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name='Chats' component={ChatsScreen} options=
          {
            {
              tabBarStyle:
              {
                backgroundColor: "#101010"
              }
                , headerShown: false
                , tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Icon
                      name="comment"
                      solid
                      size={30}
                      color="white"
                    />
                  ) : (
                    <Icon
                      name="comment"
                      solid
                      size={30}
                      color="#989898"
                    />
                  )
              }
            }
            />
        <Tab.Screen name='Profile' component={ProfileScreen} options=
          {
            {
              tabBarStyle:
              {
                backgroundColor: "#101010"
              }
                , headerShown: false
                , tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Icon
                      name="user"
                      solid
                      size={30}
                      color="white"
                    />
                  ) : (
                    <Icon
                      name="user"
                      solid
                      size={30}
                      color="#989898"
                    />
                  )
              }
            }
            />
      </Tab.Navigator>
    );
  }

  const AuthStack= ()=>{
    return(
      <Stack.Navigator>
        <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    );
  };

  const MainStack = () =>{
    return(
    <Stack.Navigator>
      <Stack.Screen name='Main' component={BottomTabs} options={{headerShown:false}}/>
      <Stack.Screen name='People' component={PeopleScreen} options={{headerShown:false}}/>
      <Stack.Screen name='Request' component={RequestChatRoom}/>
      <Stack.Screen name='ChatRoom' component={ChatRoom}/>
     </Stack.Navigator>
    );
  }
  return (
    <NavigationContainer>
      {token === null || token === '' ? <AuthStack/> : <MainStack/>}
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})

