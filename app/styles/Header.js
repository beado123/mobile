import React, {Component} from 'react';
import { StyleSheet } from 'react-native';


{/*Design follows from https://www.youtube.com/watch?v=hFHMboJk6yg&t=474s*/}
module.exports = StyleSheet.create({
  headerBackground: {
    flex:1,
    alignSelf: 'stretch',
  },
  header: {
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  profilepicWrap: {
    width: 90,
    height: 90,
    borderRadius: 30,
    borderColor: '#000',
    borderWidth: 1,
  },
  profilepic: {
    flex: 1,
    width: null,
    alignItems: 'stretch',
    borderColor: '#cfd2d4',
    borderWidth: 5
  },
  name: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  },
  username: {
      fontSize: 14,
      color: '#f6e9e0',
  },
  button: {
      width:60,
      height:50,
      borderColor: '#000',
      borderRadius: 30,
      backgroundColor: '#BFDDEF',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10
  }

});
