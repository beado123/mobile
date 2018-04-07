import React, {Component} from 'react';
import { Buffer } from 'buffer'
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList, Linking, AsyncStorage, ScrollView } from 'react-native';
import { List, ListItem, Icon, SearchBar } from "react-native-elements";
import { Container, Content, Picker } from 'native-base';
import styleRepo from '/home/yihan/AwesomeProject/app/styles/Repository';

export default class RepoPage extends React.Component {

    state = {
        data: [],
        user: '',
        psw: '',
        starColor: '#F2D13A',
        reposColor: {},
        reposColorStatus: {},
        refreshing: false,
        search: '',
        sort: undefined
    };

    componentWillMount(){
        this.fetchData();
    }

    /*This function sets up the data needed when loading the repository view. */
    fetchData = async () => {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const { params } = this.props.navigation.state;
        const login = params ? params.name : username;
        this.setState({user: login, psw: password});
        if(login == username){
            try{
                const reposJson = await AsyncStorage.getItem('repos');
                let repos = JSON.parse(reposJson);
                var dict = {};
                repos.forEach(function (item){
                    var repoName = item.name;
                    fetch('http://api.github.com/user/starred/'+login+'/'+repoName ,{
                    method: 'GET',
                    headers: {
                      'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64')
                    },
                    })
                    .then(res => {
                        if(res.status == 204){
                            dict[repoName] = '#F2D13A';
                            this.setState({reposColor: dict, data: repos});
                            this.setState(this.state);
                        }
                        else if(res.status == 404){
                            dict[repoName] =  'grey';
                            this.setState({reposColor: dict, data: repos});
                            this.setState(this.state);
                        }
                    })
                    .catch((error) =>{
                        console.error(error);
                    });
                }.bind(this));
            }
            catch(error){
                console.error(error);
            }
        }else{
            fetch('http://api.github.com/users/'+login+'/repos')
            .then(res => res.json())
              .then(res => {
                this.setState({data: res || [], refreshing: false})
              }).catch((error) =>{
                console.error(error);
              });
        }
    }

    /*This function redirects to the url of a specific repository.  */
    openRepo = (login, name) => {
        const url = 'https://github.com/'+login + '/' + name;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    /*This function changes starring status of current repository and changes its color. */
    changeStarStatus = (repoName) => {
        newdata = this.state.data;
        var dict = this.state.reposColor;
        if(this.state.reposColor[repoName] == this.state.starColor){
            dict[repoName] = 'grey';
            this.setState({reposColor: dict});
            fetch('http://api.github.com/user/starred/'+this.state.user+'/'+repoName, {
              method: 'DELETE',
              headers: {
                'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64')
              },
            }).catch((error) =>{
                console.error(error);
            });
        }
        else if(this.state.reposColor[repoName] == 'grey'){
            dict[repoName] = '#F2D13A';
            this.setState({reposColor: dict});
            fetch('http://api.github.com/user/starred/'+this.state.user+'/'+repoName, {
              method: 'PUT',
              headers: {
                'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64'),
                'Content-Lenght': 0,
              },
            }).catch((error) =>{
                console.error(error);
            });
        }
    }

    /*This function handles refreshing current list. */
    handleRefresh = () => {
        this.setState({refreshing: true},() => {
            this.setState({refreshing:false});
        });
    }

    /* This function sorts user by their star gazers count, descending,
    sort by their created date, from most recent*/
    sortRepo = (itemValue, itemIndex) => {
        this.setState({sort: itemValue});
        var dict = this.state.data;
        if(itemValue == 'stars'){
            dict.sort(function compareByNumber(a,b) {
              if (a.stargazers_count < b.stargazers_count)
                return 1;
              if (a.stargazers_count > b.stargazers_count)
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
                <Text style={styleRepo.header}>repositories</Text>
                <SearchBar placeholder="Type Here..." lightTheme round onChangeText={(text) => this.setState({search:text})}/>
                <Container style={{height:34}}>
                    <Content>
                        <Picker
                            iosHeader="Select one"
                            mode = "dropdown"
                            placeholder="Select One to Sort"
                            selectedValue={this.state.sort}
                            onValueChange={(itemValue, itemIndex) => this.sortRepo(itemValue, itemIndex)}>
                            <Picker.Item label="star gazers count" value="stars" />
                            <Picker.Item label="create date" value="created_at" />
                        </Picker>
                    </Content>
                 </Container>
                <List style={{flex:1}}>
                    <FlatList
                        data={this.state.data.filter(item => item.name.includes(this.state.search))}
                        extraData={this.state}
                        refreshing = {this.state.refreshing}
                        onRefresh = {this.handleRefresh}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item }) => (
                            <ListItem
                                rightIcon = {{name: 'star', color: this.state.reposColor[item.name]}}
                                onPressRightIcon = {() => this.changeStarStatus(item.name)}
                                title={item.name }
                                subtitle={item.description}
                                subtitleNumberOfLines = {10}
                                onLongPress = {() => this.openRepo(item.owner.login,item.name)}
                            />
                        )}
                    />
                </List>
            </ScrollView>
        );
    }
}
