import React, {Component} from 'react';
import { StyleSheet} from 'react-native';
import { Constants } from 'expo';

{/*style follows from https://www.youtube.com/watch?v=jGU2I6sYDLE*/}
module.exports = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
      alignItems: 'center',
  },
  logo: {
      color: 'white',
      fontSize: 30,
      fontFamily: 'Georgia',
      textShadowColor: '#429DD4',
      textShadowOffset: {width:2, height:2},
      textShadowRadius: 15,
      marginTop: 50
  },
  inputContainer: {
      marginBottom: 0,
      margin: 70,
      padding: 20,
      paddingBottom: 10,
      alignSelf: 'stretch',
      borderWidth: 1,
      borderColor: '#ffff',
  },
  input: {
      fontSize: 16,
      fontFamily: 'Palatino',
      height: 40,
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#DDEDF6'
  },
  buttonLogin: {
      alignSelf: 'stretch',
      margin: 10,
      padding: 10,
      backgroundColor: 'blue',
      borderWidth: 1,
      borderColor: '#fff',
      backgroundColor: '#BFDDEF'
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    textAlign: 'center'
  },

});
