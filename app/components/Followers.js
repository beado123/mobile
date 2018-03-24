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
        followers: {}
    };

    componentWillMount(){
        this.fetchData();
    }

    fetchData = async () => {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const { params } = this.props.navigation.state;
        const login = params ? params.name : username;
        this.setState({username: username, user: login, psw: password});
        console.log('fetching data...');
        if(login === username){
            try{
                var followers_dict = {};
                let followersJson = await AsyncStorage.getItem('followers');
                let followers = JSON.parse(followersJson);
                followers.forEach(function(item){
                    var followerName = item.login;
                    fetch('http://api.github.com/user/following/'+followerName, {
                      method: 'GET',
                      headers: {
                        'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64'),
                        'Content-Lenght': 0,
                      },
                    }).then((response) => {
                        if(response.status ==204){
                            console.log('is following '+followerName);
                            followers_dict[followerName] = 'unfollow';
                            this.setState({followers: followers_dict, data: followers});
                            this.setState(this.state);
                        }else if(response.status == 404){
                            console.log('not following '+followerName);
                            followers_dict[followerName] = 'follow';
                            this.setState({followers: followers_dict, data: followers});
                            this.setState(this.state);
                        }
                    }).catch((error) =>{
                        console.error(error);
                    });
                }.bind(this));
            }
            catch(error){
                console.error(error);
            }
        }else{
            fetch('http://api.github.com/users/'+login+'/followers')
            .then(res => res.json())
              .then(res => {
                this.setState({data: res || [], refreshing: false})
              }).catch((error) =>{
                console.error(error);
              });
        }
    }

    handleRefresh = () => {
        console.log("handle refresh");
        this.setState({refreshing: true},() => {
            this.fetchData();
        });
    };
    changeFollowStatus = (login) => {
        fetch('http://api.github.com/user/following/'+login ,{
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64')
            },
        })
        .then(res => {
            //I am following this user and want to unfollow him
            if(res.status == 204){
                console.log('is following '+login);
                fetch('http://api.github.com/user/following/'+login, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64')
                  },
                }).then( async (response) => {
                    console.log('unfollowed '+login);
                    //remove him from following in local storage
                    try{
                        let followingJson = await AsyncStorage.getItem('following');
                        let following = JSON.parse(followingJson);
                        following = following.filter(function(item){
                            return item.login !== login;
                        });
                        AsyncStorage.setItem('following', JSON.stringify(following));
                        var followers_dict = this.state.followers;
                        followers_dict[login] = 'follow';
                        let followersJson = await AsyncStorage.getItem('followers');
                        let followers = JSON.parse(followersJson);
                        this.setState({followers: followers_dict, data: followers});
                        console.log('after filter, following '+following.length);
                    }
                    catch(error){
                        console.error(error);
                    }
                }).catch((error) =>{
                    console.error(error);
                });
            }
            //I am not following this user and want to follow him
            else if(res.status == 404){
                console.log('not following '+login);

                fetch('http://api.github.com/user/following/'+login, {
                  method: 'PUT',
                  headers: {
                    'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64'),
                    'Content-Lenght': 0,
                  },
                }).then( async (response) => {
                    console.log('followed '+login);
                    //add this user to following in local storage
                    try{
                        let followingJson = await AsyncStorage.getItem('following');
                        let following = JSON.parse(followingJson);
                        let followersJson = await AsyncStorage.getItem('followers');
                        let followers = JSON.parse(followersJson);
                        var newFollowing = followers.find(function(item){
                            return item.login = login;
                        });
                        //console.log(newFollowing);
                        following.push(newFollowing);
                        console.log('after push, following '+following.length);
                        AsyncStorage.setItem('following', JSON.stringify(following));
                        var followers_dict = this.state.followers;
                        followers_dict[login] = 'unfollow';
                        this.setState({followers: followers_dict, data: followers});
                    }
                    catch(error){
                        console.error(error);
                    }
                }).catch((error) =>{
                  console.error(error);
                });
            }
        }).catch((error) =>{
            console.error(error);
        });
    };

    render() {
        return (
            <View style={styleRepo.container}>
                <Text style={styleRepo.header}>followers</Text>
                <List>
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        refreshing = {this.state.refreshing}
                        onRefresh = {this.handleRefresh}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item }) => (
                            <ListItem
                                roundAvatar
                                avatar={{uri:item.avatar_url}}
                                avatarStyle	={{width: 60, height:60}}
                                avatarContainerStyle={{width: 60, height:60}}
                                title={item.login }
                                titleStyle={{fontSize:17}}
                                onPress = {() => this.props.navigation.navigate('profile',{name: item.login,})}
                                rightIcon = {<TouchableOpacity style={this.state.username == this.state.user ? styleRepo.followButton: styleRepo.none}>
                                                <Text style={styleRepo.followText} onPress={ () => this.changeFollowStatus(item.login)}>{this.state.followers[item.login]}</Text>
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
