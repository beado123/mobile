import React, {Component} from 'react';
import { Buffer } from 'buffer'
import { Constants } from 'expo';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList, Linking, AsyncStorage } from 'react-native';
import { List, ListItem } from "react-native-elements";
import styleRepo from '/home/yihan/AwesomeProject/app/styles/Repositry';

export default class FollowersPage extends React.Component {

    state = {
        data: [],
        user: '',
        username: '',
        psw: '',
        refreshing: false,
        following: {}
    };

    componentDidMount(){
        this.fetchData();
    };

    fetchData = async () => {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const { params } = this.props.navigation.state;
        const login = params ? params.name : username;
        this.setState({username: username, user: login, psw: password});
        console.log('following page: fetching data, '+login);
        if(login === username){
            try{
                console.log('from local storage');
                let followingJson = await AsyncStorage.getItem('following');
                let following = JSON.parse(followingJson);
                following_dict = {};
                following.forEach(function(item){
                    following_dict[item.login] = 'unfollow';
                });
                this.setState({data: following || [],
                            refreshing: false,
                            following: following_dict
                });
            }
            catch(error){
                console.error(error);
            }
        }else{
            fetch('http://api.github.com/users/'+login+'/following')
            .then(res => res.json())
              .then(res => {
                this.setState({data: res || [], refreshing: false})
              }).catch((error) =>{
                console.error(error);
              });
        }
    };

    handleRefresh = () => {
        console.log("handle refresh");
        this.setState({refreshing: true},() => {
            this.fetchData();
        });
    };
    unfollow = (username) => {

        fetch('http://api.github.com/user/following/'+username, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64')
          },
        }).then( async (response) => {
            console.log('unfollowed '+username);
            try{
                let followingJson = await AsyncStorage.getItem('following');
                let following = JSON.parse(followingJson);
                following = following.filter(function(item){
                    return item.login !== username;
                });
                AsyncStorage.setItem('following', JSON.stringify(following));
                var following_dict = this.state.following;
                following_dict[username] = 'follow';
                this.setState({following: following_dict});
                console.log('after filter, following '+following.length);
            }
            catch(error){
                console.error(error);
            }
        }).catch((error) =>{
            console.error(error);
        });
    };

    render() {
        return (
            <View style={styleRepo.container}>
                <Text style={styleRepo.header}>following</Text>
                <List>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        keyExtractor={(item) => item.id}
                        refreshing = {this.state.refreshing}
                        onRefresh = {this.handleRefresh}
                        renderItem={({ item }) => (
                            <ListItem
                                roundAvatar
                                avatar={{uri:item.avatar_url}}
                                avatarStyle	={{width: 60, height:60}}
                                avatarContainerStyle={{width: 60, height:60}}
                                title={item.login }
                                titleStyle={{fontSize:17}}
                                onPress = {() => this.props.navigation.navigate('profile',{name: item.login,})}
                                rightIcon = { <TouchableOpacity style={this.state.user== this.state.username ? styleRepo.followButton: styleRepo.none}>
                                                <Text style={styleRepo.followText} onPress={ () => this.unfollow(item.login)}>{this.state.following[item.login]}</Text>
                                            </TouchableOpacity>
                                }
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
