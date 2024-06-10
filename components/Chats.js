import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const Chats = ({ item }) => {
    const navigation = useNavigation();
    const { userId } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const fetchMessages = async () => {
        try {
            const senderId = userId;
            const receiverId = item?._id;

  
            const response = await axios.get('http://192.168.1.4:8000/messages', {
                params: { senderId, receiverId },
            });

            setMessages(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchMessages();
    }, []);

    const getLastMessage = () => {
        const n = messages.length;

        return messages[n - 1];
    };
    const lastMessage = getLastMessage();

    return (
        <Pressable
            onPress={() =>
                navigation.navigate('ChatRoom', {
                    name: item?.name,
                    receiverId: item?._id,
                    image: item?.image,
                })
            }
            style={{ marginVertical: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Pressable>
                    <Image
                        source={{ uri: item?.image }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                </Pressable>

                <View>
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>{item?.name}</Text>
                    <Text style={{ marginTop: 4, color: 'gray' }}>
                        {lastMessage
                            ? lastMessage.message
                            : `Start chat with ${item?.name}`}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default Chats;

const styles = StyleSheet.create({});