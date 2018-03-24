import React, {Component} from 'react';
import { Buffer } from 'buffer'
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList, Linking, AsyncStorage } from 'react-native';
import { List, ListItem, Icon } from "react-native-elements";
import styleRepo from '/home/yihan/AwesomeProject/app/styles/Repositry';

{/*The way of fetching data follows from https://www.youtube.com/watch?v=IuYo009yc8w*/}
export default class RepoPage extends React.Component {
    state = {
        data: [],
        user: '',
        psw: '',
        starColor: '#F2D13A',
        reposColor: {},
        reposColorStatus: {},
        refreshing: false
    };
    componentWillMount(){
        this.fetchData();
    }
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

    openRepo = (login, name) => {
        const url = 'https://github.com/'+login + '/' + name;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    changeStarStatus = (repoName) => {
        newdata = this.state.data;
        console.log('in changeStarStatus');
        console.log('repo: '+repoName);
        if(this.state.reposColor[repoName] == this.state.starColor){
            fetch('http://api.github.com/user/starred/'+this.state.user+'/'+repoName, {
              method: 'DELETE',
              headers: {
                'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64')
              },
            }).then((response) => {
                console.log('unstarred '+repoName);
                var dict = this.state.reposColor;
                dict[repoName] = 'grey';
                this.setState({reposColor: dict});
            }).catch((error) =>{
                console.error(error);
            });
        }
        else if(this.state.reposColor[repoName] == 'grey'){
            fetch('http://api.github.com/user/starred/'+this.state.user+'/'+repoName, {
              method: 'PUT',
              headers: {
                'Authorization': 'Basic ' + new Buffer(this.state.user + ':' + this.state.psw).toString('base64'),
                'Content-Lenght': 0,
              },
            }).then((response) => {
                console.log('starred '+repoName);
                var dict = this.state.reposColor;
                dict[repoName] = '#F2D13A';
                this.setState({reposColor: dict});
            }).catch((error) =>{
                console.error(error);
            });
        }

    }

    handleRefresh = () => {
        this.setState({refreshing: true},() => {
            this.setState({refreshing:false});
        });
    }

    render() {
        return (
            <View style={styleRepo.container}>
                <Text style={styleRepo.header}>repositries</Text>
                <List style={{flex:1}}>
                    <FlatList
                        data={this.state.data}
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
                <View style={styleRepo.footer}>
                    <TouchableOpacity style={styleRepo.gobackButton}>
                        <Text style={{color:'#fff'}} onPress={() => this.props.navigation.goBack()}> Go Back </Text>
                        </TouchableOpacity>
                </View>
            </View>
        );
    }
}
