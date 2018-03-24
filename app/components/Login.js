import React, {Component} from 'react';
import { StyleSheet, Text, View, ImageBackground, Button, TouchableOpacity, TextInput, Linking, AsyncStorage } from 'react-native';
import { List, ListItem } from "react-native-elements";
import { Constants } from 'expo';
import styleLogin from '/home/yihan/AwesomeProject/app/styles/Login.js';
import styleHeader from '/home/yihan/AwesomeProject/app/styles/Header.js';

export default class FollowersPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            psw: ''
        };
    }
    login = () => {
        AsyncStorage.setItem('username', this.state.username);
        AsyncStorage.setItem('password', this.state.psw);
        this.props.navigation.navigate('profile');
    };

    render() {
        return (
            <View style={styleLogin.container}>
                <ImageBackground style={styleHeader.headerBackground} source={require('/home/yihan/AwesomeProject/app/img/wallpaper2.jpg')}>
                    <View style={styleLogin.content}>
                        <Text style={styleLogin.logo}>Github Manager</Text>
                            <View style={styleLogin.inputContainer}>
                                <TextInput style={styleLogin.input} onChangeText={(text) => this.setState({username:text})} placeholder='username'></TextInput>
                                <TextInput secureTextEntry={true} style={styleLogin.input} onChangeText={(text) => this.setState({psw:text})} placeholder='password'></TextInput>
                                <TouchableOpacity style = {styleLogin.buttonLogin} onPress = {() => this.login()}>
                                    <Text style={styleLogin.buttonText}>LOGIN</Text>
                                </TouchableOpacity>
                            </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
