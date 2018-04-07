import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { Buffer } from 'buffer'
import { StyleSheet,Text,View,ScrollView,Image,AppRegistry,Button,ImageBackground,TouchableOpacity, AsyncStorage, RefreshControl} from 'react-native';
import styleHeader from '/home/yihan/AwesomeProject/app/styles/Header';
import styleBar from '/home/yihan/AwesomeProject/app/styles/Bar';

{/*Design follows from https://www.youtube.com/watch?v=hFHMboJk6yg&t=474s*/}
export default class ProfilePage extends React.Component {

    state = {
        login: '',
        username: '',
        followers: -1,
        following: -1,
        public_repos: -1,
        avatar_url: 'blah',
        created_at: '',
        refreshing: false,
    };

    componentWillMount(){
        this.fetchData();
    };

    /*This function fetches data from github api.  */
    fetchDataFromAPI =  async (login, ending, username, password) => {
        const response = await fetch('http://api.github.com/user' + ending, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
            },
        });
        let responseJson = await response.json();
        return responseJson;
    };

    /*This function sets up the data needed when loading the profile view. */
    fetchData = async () => {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const { params } = this.props.navigation.state;
        const login = params ? params.name : username;
        const userJson = await this.fetchDataFromAPI(login, '', username, password);
        const followingJson = await this.fetchDataFromAPI(login, '/following', username, password);
        const followersJson = await this.fetchDataFromAPI(login, '/followers', username, password);
        const reposJson = await this.fetchDataFromAPI(login, '/repos', username, password);
        if( login == username){
            AsyncStorage.setItem('followers', JSON.stringify(followersJson));
            AsyncStorage.setItem('following', JSON.stringify(followingJson));
            AsyncStorage.setItem('repos', JSON.stringify(reposJson));
        }
        this.setState({followers: userJson.followers,
                       following: userJson.following,
                       public_repos: userJson.public_repos,
                       login: login,
                       username: username,
                       avatar_url: userJson.avatar_url,
                       created_at: userJson.created_at.substring(0,9)
        });
    };

    /*This function updates number of following, followers on the profile page. */
    updateData = async () => {
        let followingJson = await AsyncStorage.getItem('following');
        let following = JSON.parse(followingJson);
        let followersJson = await AsyncStorage.getItem('followers');
        let followers = JSON.parse(followersJson);
        this.setState({followers: followers.length, following: following.length});
    };

    /*This function handles refreshing of current list. */
    _onRefresh = () => {
        this.setState({refreshing: true});
        this.updateData().then(() => {
            this.setState({refreshing: false});
        });
    }

  render(){
    return (
        <ScrollView refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                      />
                        }contentContainerStyle={{flexGrow: 1,}} scrollEnabled>

            <View style={{flex:1,flexDirection: 'column'}}  >
                <ImageBackground style={styleHeader.headerBackground} source={require('/home/yihan/AwesomeProject/app/img/wallpaper2.jpg')}>
                    <View style={styleHeader.header}>
                        <View style={styleHeader.profilepicWrap}>
                            <Image style={styleHeader.profilepic} source={{uri: this.state.avatar_url}} />
                        </View>
                        <Text style={styleHeader.name}>{this.state.login}</Text>
                        {this.state.login != this.state.username && <TouchableOpacity style={styleHeader.button} onPress = {() =>this.props.navigation.goBack()}>
                            <Text >Go Back</Text>
                        </TouchableOpacity>}
                        {this.state.login == this.state.username && <TouchableOpacity style={styleHeader.buttonWide} onPress = {() =>this.props.navigation.navigate('notifications',{name: this.state.login})}>
                            <Text >Notifications</Text>
                        </TouchableOpacity>}
                        {this.state.login == this.state.username && <TouchableOpacity style={styleHeader.buttonWide} onPress = {() =>this.props.navigation.navigate('visualization')}>
                            <Text >Visualization</Text>
                        </TouchableOpacity>}
                    </View>

                    <View style={styleBar.bar}>
                        <View style={styleBar.firstBar}>
                          <View style={[styleBar.barItem, styleBar.barseparator]}>
                            <Text style={styleBar.barTop}>{this.state.followers}</Text>
                            <Text style={styleBar.barBottom} onPress={() => this.props.navigation.navigate('followers',{name: this.state.login})}>Followers</Text>
                          </View>
                          <View style={[styleBar.barItem, styleBar.barseparator]}>
                            <Text style={styleBar.barTop}>{this.state.following}</Text>
                            <Text style={styleBar.barBottom} onPress={() => this.props.navigation.navigate('following',{name: this.state.login})}>Following</Text>
                          </View>
                          <View style={styleBar.barItem}>
                            <Text style={styleBar.barTop}>{this.state.public_repos}</Text>
                            <Text style={styleBar.barBottom} onPress={() => this.props.navigation.navigate('repository',{name: this.state.login})}>Repository</Text>
                          </View>
                        </View>
                        <View style={styleBar.dateBar}>
                            <Text style={styleBar.barTop}>Created at</Text>
                            <Text style={styleBar.barBottom}>{this.state.created_at}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
      </ScrollView>
    );
  }
}
