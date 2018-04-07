import React, {Component} from 'react';
import { Buffer } from 'buffer'
import { Constants } from 'expo';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList, Linking, AsyncStorage, ScrollView } from 'react-native';
import { List, ListItem, SearchBar } from "react-native-elements";
import { Container, Content, Picker } from 'native-base';
import styleRepo from '/home/yihan/AwesomeProject/app/styles/Repository';

export default class FollowersPage extends React.Component {

    state = {
        data: [],
        user: '',
        username: '',
        psw: '',
        refreshing: false,
        followers: {},
        sort: undefined,
        search: ''
    };

    componentWillMount(){
        this.fetchData();
    }

    /*This function sets up the data needed when loading the followers view. */
    fetchData = async () => {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const { params } = this.props.navigation.state;
        const login = params ? params.name : username;
        this.setState({username: username, user: login, psw: password});
        if(login === username){
            try{
                var followers_text = {};
                let followersJson = await AsyncStorage.getItem('followers');
                let followers = JSON.parse(followersJson);
                followers_dict = [];
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
                            followers_text[followerName] = 'unfollow';
                            this.setState({followers: followers_text, data: followers});
                            this.setState(this.state);
                        }else if(response.status == 404){
                            followers_text[followerName] = 'follow';
                            this.setState({followers: followers_text, data: followers});
                            this.setState(this.state);
                        }
                    }).catch((error) =>{
                        console.error(error);
                    });
                    //fetch user data from each follower
                    var res = fetch('http://api.github.com/users/' + item.login)
                    res.then((response) => response.json())
                      .then((responseJson) => {
                          followers_item = {}
                          followers_item['login'] = responseJson.login;
                          followers_item['followers'] = responseJson.followers;
                          followers_item['created_at'] = responseJson.created_at;
                          followers_item['avatar_url'] = item.avatar_url;
                          followers_item['id'] = item.id;
                          followers_dict.push(followers_item);
                          this.setState({ data: followers_dict});
                          this.setState(this.state);
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

    /*This function handles refreshing of current list. */
    handleRefresh = () => {
        console.log('refreshing');
        this.setState({refreshing: true},() => {
            this.fetchData();
        });
    };

    /*This function follow or unfollow the github user chosen and changes the text on option button accordingly. */
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
                fetch('http://api.github.com/user/following/'+login, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64')
                  },
                }).then( async (response) => {
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
                fetch('http://api.github.com/user/following/'+login, {
                  method: 'PUT',
                  headers: {
                    'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64'),
                    'Content-Lenght': 0,
                  },
                }).then( async (response) => {
                    //add this user to following in local storage
                    try{
                        let followingJson = await AsyncStorage.getItem('following');
                        let following = JSON.parse(followingJson);
                        let followersJson = await AsyncStorage.getItem('followers');
                        let followers = JSON.parse(followersJson);
                        var newFollowing = followers.find(function(item){
                            return item.login = login;
                        });
                        following.push(newFollowing);
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

    /* This function sorts user by their number of followers, descending,
    sort by their created date, from most recent*/
    sortFollowers = (itemValue, itemIndex) => {
        this.setState({sort: itemValue});
        var dict = this.state.data;
        if(itemValue == 'followers'){
            dict.sort(function compareByNumber(a,b) {
              if (a.followers < b.followers)
                return 1;
              if (a.followers > b.followers)
                return -1;
              return 0;
            });
        }
        else if(itemValue == 'created_at'){
            dict.sort(function(a,b){
              return new Date(b.created_at) - new Date(a.created_at);
            });
        }
        this.setState({data: dict})
    }

    render() {
        return (
            <ScrollView style={styleRepo.container}>
                <Text style={styleRepo.header}>followers</Text>
                <SearchBar placeholder="Type Here..." lightTheme round onChangeText={(text) => this.setState({search:text})}/>
                <Container style = {{height:30}}>
                    <Content>
                        <Picker
                            iosHeader="Select one"
                            mode = "dropdown"
                            placeholder="Select One to Sort"
                            selectedValue={this.state.sort}
                            onValueChange={(itemValue, itemIndex) => this.sortFollowers(itemValue, itemIndex)}>
                            <Picker.Item label="followers" value="followers" />
                            <Picker.Item label="create date" value="created_at" />
                        </Picker>
                    </Content>
                 </Container>
                <List>
                    <FlatList
                        data={this.state.data.filter(item => item.login.includes(this.state.search))}
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
            </ScrollView>
        );
    }
}
