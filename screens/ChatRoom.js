import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useSocketContext } from '../SocketContext';
import EmojiSelector from "react-native-emoji-selector";

const ChatRoom = () => {
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [messages, setMessages] = useState([]);
    const { token, userId, setToken, setUserId } = useContext(AuthContext);
    const { socket } = useSocketContext();

    const handleEmojiPress = () => {
        setShowEmojiSelector(!showEmojiSelector);
    };


    const route = useRoute();
    useLayoutEffect(() => {
        return navigation.setOptions({
            headerTitle: '',
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    {selectedMessages.length > 0 ? (
                        <View>
                            <Text style={{ color:"black" ,fontSize: 16, fontWeight: "500" }}>
                                {selectedMessages.length}
                            </Text>
                        </View>
                    ) : (
                        < View >
                            <Text style={{ color: 'black' }}>{route?.params?.name}</Text>
                        </View>)}
                </View >
            ),
            headerRight: () =>
                selectedMessages.length > 0 ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="send" size={24} color="black" />
                    <FontAwesome name="star" size={24} color="black" />
                    <MaterialIcons
                      onPress={() => deleteMessages(selectedMessages)}
                      name="delete"
                      size={24}
                      color="black"
                    />
                  </View>
                ) : null,
        });
    }, [selectedMessages]);

    const deleteMessages = async (messageIds) => {
        try {
          const response = await fetch("http://192.168.1.4:8000/deleteMessages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: messageIds }),
          });
    
          if (response.ok) {
            setSelectedMessages((prevSelectedMessages) =>
            prevSelectedMessages.filter((id) => !messageIds.includes(id))
          );
    
            fetchMessages();
          } else {
            console.log("error deleting messages", response.status);
          }
        } catch (error) {
          console.log("error deleting messages", error);
        }
      };

    const listenMessages = () => {
        const { socket } = useSocketContext();

        useEffect(() => {
            socket?.on('newMessage', newMessage => {
                newMessage.shouldShake = true;
                setMessages([...messages, newMessage]);
            });

            return () => socket?.off('newMessage');
        }, [socket, messages, setMessages]);
    };

    listenMessages();
    const sendMessage = async (senderId, receiverId) => {
        try {
            await axios.post('http://192.168.1.4:8000/sendMessage', {
                senderId,
                receiverId,
                message,
            });

            socket.emit('sendMessage', { senderId, receiverId, message });

            setMessage('');

            setTimeout(() => {
                fetchMessages();
            }, 100);
        } catch (error) {
            console.log('Error', error);
        }
    };
    const fetchMessages = async () => {
        try {
            const senderId = userId;
            const receiverId = route?.params?.receiverId;

            const response = await axios.get('http://192.168.1.4:8000/messages', {
                params: { senderId, receiverId },
            });

            setMessages(response.data);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    console.log('messages', messages);
    const formatTime = time => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return new Date(time).toLocaleString('en-US', options);
    };

    const handleSelectMessage = (message) => {
        //check if the message is already selected
        const isSelected = selectedMessages.includes(message._id);

        if (isSelected) {
            setSelectedMessages((previousMessages) =>
                previousMessages.filter((id) => id !== message._id)
            );
        } else {
            setSelectedMessages((previousMessages) => [
                ...previousMessages,
                message._id,
            ]);
        }
    };


    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                {messages?.map((item, index) => {
                    const isSelected = selectedMessages.includes(item._id);
                    return (
                        <Pressable
                            onLongPress={() => handleSelectMessage(item)}
                            key={item?._id}
                            style={[
                                item?.senderId?._id === userId
                                    ? {
                                        alignSelf: 'flex-end',
                                        backgroundColor: '#DCF8C6',
                                        padding: 8,
                                        maxWidth: '60%',
                                        borderRadius: 7,
                                        margin: 10,
                                    }
                                    : {
                                        alignSelf: 'flex-start',
                                        backgroundColor: 'aqua',
                                        padding: 8,
                                        margin: 10,
                                        borderRadius: 7,
                                        maxWidth: '60%',
                                    },
                                isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                            ]}>
                            <Text style={{ fontSize: 13, color: "black", textAlign: isSelected ? "right" : "left" }}>{item?.message}</Text>
                            <Text style={{ textAlign: "right", fontSize: 9, color: "gray", marginTop: 4 }}>{formatTime(item?.timeStamp)}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            <View
                style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: '#dddddd',
                    marginBottom: showEmojiSelector ? 0 : 25,
                }}>
                <Entypo onPress={handleEmojiPress} name="emoji-happy" size={24} color="gray" />

                <TextInput
                    placeholder="type your message..."
                    value={message}
                    onChangeText={setMessage}
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: '#ddddd',
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        marginLeft: 10,
                    }}
                />

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        marginHorizontal: 8,
                    }}>
                    <Entypo name="camera" size={24} color="gray" />

                    <Feather name="mic" size={24} color="gray" />
                </View>

                <Pressable
                    onPress={() => sendMessage(userId, route?.params?.receiverId)}
                    style={{
                        backgroundColor: '#0066b2',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                    }}>
                    <Text style={{ textAlign: 'center', color: 'white' }}>Send</Text>
                </Pressable>
            </View>

            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) => {
                        setMessage((prevMessage) => prevMessage + emoji);
                    }}
                    style={{ height: 250 }}
                />
            )}
        </KeyboardAvoidingView>
    );
};

export default ChatRoom;

const styles = StyleSheet.create({});