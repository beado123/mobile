import React, {Component} from 'react';
import { Buffer } from 'buffer'
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList, Linking, AsyncStorage, ScrollView } from 'react-native';
import { Container, Content, Picker } from 'native-base';
import { List, ListItem, SearchBar } from "react-native-elements";
import styleRepo from '/home/yihan/AwesomeProject/app/styles/Repository';

export default class FollowingPage extends React.Component {

    state = {
        data: [],
        user: '',
        username: '',
        psw: '',
        refreshing: false,
        following: {},
        search: '',
        sort: undefined
    };

    componentWillMount(){
        this.fetchData();
    };

    /*This function sets up the data needed when loading the following view. */
    fetchData = async () => {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const { params } = this.props.navigation.state;
        const login = params ? params.name : username;
        this.setState({username: username, user: login, psw: password});
        if(login === username){
            try{
                let followingJson = await AsyncStorage.getItem('following');
                let following = JSON.parse(followingJson);
                following_dict = [];
                following_text = {}
                following.forEach( function(item){
                    following_text[item.login] = 'unfollow';
                    var res = fetch('http://api.github.com/users/' + item.login)
                    res.then((response) => response.json())
                      .then((responseJson) => {
                          following_item = {}
                          following_item['login'] = responseJson.login;
                          following_item['followers'] = responseJson.followers;
                          following_item['created_at'] = responseJson.created_at;
                          following_item['avatar_url'] = item.avatar_url;
                          following_item['id'] = item.id;
                          following_dict.push(following_item);
                          this.setState({ data: following_dict});
                          this.setState(this.state);
                    }).catch((error) =>{
                        console.error(error);
                    });
                }.bind(this));
                this.setState({data: following_dict || [],
                            refreshing: false,
                            following: following_text
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

    /*This function handles refreshing of current list. */
    handleRefresh = () => {
        console.log('refreshing');
        this.setState({refreshing: true},() => {
            this.fetchData();
        });
    };

    /*This function unfollows the github user chosen, and changes text on the button to 'follow' */
    unfollow = (username) => {

        fetch('http://api.github.com/user/following/'+username, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64')
          },
        }).then( async (response) => {
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
            }
            catch(error){
                console.error(error);
            }
        }).catch((error) =>{
            console.error(error);
        });
    };

    /* This function sorts user by their number of followers, descending,
    sort by their created date, from most recent*/
    sortFollowing = (itemValue, itemIndex) => {
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
                <Text style={styleRepo.header}>following</Text>
                <SearchBar placeholder="Type Here..." lightTheme round onChangeText={(text) => this.setState({search:text})}/>
                <Container style = {{height:30}}>
                    <Content>
                        <Picker
                            iosHeader="Select one"
                            mode = "dropdown"
                            placeholder="Select One to Sort"
                            selectedValue={this.state.sort}
                            onValueChange={(itemValue, itemIndex) => this.sortFollowing(itemValue, itemIndex)}>
                            <Picker.Item label="followers" value="followers" />
                            <Picker.Item label="create date" value="created_at" />
                        </Picker>
                    </Content>
                 </Container>
                <List>
                    <FlatList
                        data={this.state.data.filter(item => item.login.includes(this.state.search))}
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
            </ScrollView>
        );
    }
}
