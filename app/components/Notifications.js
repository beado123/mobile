import React, {Component} from 'react';
import { Buffer } from 'buffer'
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList, Linking, AsyncStorage } from 'react-native';
import { List, ListItem } from "react-native-elements";
import styleRepo from '/home/yihan/AwesomeProject/app/styles/Repository';

export default class NotificationsPage extends React.Component {

    state = {
        data: [],
        user: '',
        username: '',
        psw: '',
        refreshing: false,
    };

    componentWillMount(){
        this.fetchData();
    }

    /*This function sets up the data needed when loading the notifications view. */
    fetchData = async () => {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const { params } = this.props.navigation.state;
        const login = params ? params.name : username;
        this.setState({username: username, user: login, psw: password});
        const response = await fetch('https://api.github.com/notifications?all=true' , {
          headers: {
            'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64'),
            'Content-Lenght': 0,
          }
      });
        let responseJson = await response.json();
        this.setState({data: responseJson});
    }

    /*This function handles refreshing of current list. */
    handleRefresh = () => {
        this.setState({refreshing: true},() => {
            this.fetchData();
        });
    };

    render() {
        return (
            <View style={styleRepo.container}>
                <Text style={styleRepo.header}>notifications</Text>
                <List>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        refreshing = {this.state.refreshing}
                        onRefresh = {this.handleRefresh}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item }) => (
                            <ListItem
                                hideChevron = {true}
                                subtitle={item.subject.title }
                                subtitleNumberOfLines = {2}
                                titleStyle={{fontSize:17}}
                                rightTitle = {item.updated_at.slice(0,-1).split('T')[0]+' '+item.updated_at.slice(0,-1).split('T')[1]}
                                rightTitleNumberOfLines = {2}
                                rightTitleStyle = {{width: 80}}
                                rightTitleContainerStyle = {{width:80}}
                                title = {item.repository.owner.login+'/'+item.repository.name}
                                titleNumberOfLines = {2}
                                titleContainerStyle	= {{width:200}}

                            />
                        )}
                    />
                </List>
                <View style={styleRepo.footer}>
                    <TouchableOpacity style={styleRepo.gobackButton}>
                        <Text style={{color:'#fff'}} onPress={() => this.props.navigation.goBack()}> Go Back </Text>
                        </TouchableOpacity>
                </View>
            </View>
        );
    }
}
