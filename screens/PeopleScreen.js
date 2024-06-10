import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import User from '../components/User.js'
import axios from 'axios';

const PeopleScreen = () => {
  const [users,setUsers] = useState([])
  const {userId} = useContext(AuthContext)
  const fetchUsers = async ()=>{
    try {
      const response = await axios.get(`http://192.168.1.4:8000/users/${userId}`);
      const data = response.data;
      setUsers(data);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(()=>{
    fetchUsers();
  },[])


  return (
    <SafeAreaView>
      <View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 15,
            fontWeight: '800',
            marginTop: 12,
          }}>
          People using ChitChat
        </Text>
      </View>
      <FlatList
        data={users}
        renderItem={({item}) => <User item={item} key={item?._id} />}
      />
    </SafeAreaView>
  )
}

export default PeopleScreen

const styles = StyleSheet.create({})