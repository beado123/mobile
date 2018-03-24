import React, {Component} from 'react';
import { StyleSheet} from 'react-native';
import { Constants } from 'expo';

{/*style follows from https://www.youtube.com/watch?v=AV41HahZEpU*/}
module.exports = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20
  },
  footer: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -10,
    height: 50,

  },
  gobackButton: {
    backgroundColor: '#64678f',
    width: 60,
    height: 60,
    borderRadius: 40,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20,
},
followButton: {
    backgroundColor: '#64678f',
    width: 70,
    height: 30,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
},
followText: {
    color: 'white'
},
none: {
    backgroundColor: 'white',
}
});
