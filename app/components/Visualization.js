import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, FlatList, Linking, AsyncStorage, ScrollView } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLabel } from "victory-native";
import styleVisual from '/home/yihan/AwesomeProject/app/styles/Visualization';


export default class VisualizationPage extends React.Component {

    state = {
        commitsInMarch: []
    };

    componentDidMount(){
        this.fetchData();
    };

    /*This function sets up the data needed when loading the visualization view. */
    fetchData = async () => {
        fetch('http://api.github.com/repos/tensorflow/tfjs/commits')
        .then((response) => response.json())
        .then((responseJson) =>{
            var commitsInMarch = responseJson.filter(function(item){
                return item.commit.author.date.substring(0,7)=='2018-03';
            });
            commitsInMarch.reverse();
            var commits = [];
            var dayTracker = ''
            commitsInDay = {};
            var first = true;
            var len = commitsInMarch.length;
            var counter = 0;
            commitsInMarch.forEach(function(item){
                var day = item.commit.author.date.substring(8,10);
                counter ++;
                if(day == dayTracker){
                    var num = commitsInDay['sum'];
                    commitsInDay['sum'] = num+1;
                    if(counter == len){
                        commits.push(commitsInDay);
                        this.setState({commitsInMarch: commits});
                    }
                }
                else{
                    if(!first){
                        commits.push(commitsInDay);
                        this.setState({commitsInMarch: commits});
                        commitsInDay = {};
                        if(day[0] == '0')commitsInDay['day'] = day[1];
                        else commitsInDay['day'] = day;
                        commitsInDay['sum'] = 1;
                        dayTracker = day;
                    }
                    else{
                        if(day[0] == '0')commitsInDay['day'] = day[1];
                        else commitsInDay['day'] = day;
                        commitsInDay['sum'] = 1;
                        first = false;
                        dayTracker = day;
                    }
                }
            }.bind(this));
            this.setState({commitsInMarch: commits});
        }).catch((error) =>{
            console.error(error)
        })
    };

    render() {
        return (
            <View style={styleVisual.container}>
                <Text style={{textAlign: 'center', fontFamily: 'Arial', padding:20, fontSize: 16}}>Daily Commits in March,2018 of repository tfjs of Github User tensorflow</Text>
                <VictoryChart width={350} theme={VictoryTheme.material} domainPadding={10}>
                   <VictoryBar data={this.state.commitsInMarch} x="day" y="sum" labels={(d) => `${d.sum}`} alignment="middle" labelComponent={<VictoryLabel dy={-10}/>}/>
                </VictoryChart>
                <Text style={{textAlign: 'center', fontFamily: 'Arial'}}>Days in March</Text>
           </View>
        );
    }
}
