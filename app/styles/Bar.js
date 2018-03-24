import React, {Component} from 'react';
import { StyleSheet } from 'react-native';

{/*Design follows from https://www.youtube.com/watch?v=hFHMboJk6yg&t=474s*/}
module.exports = StyleSheet.create({
  bar: {
    flex:0.4,
    backgroundColor: '#64678f',
    flexDirection: 'column',
  },
  firstBar: {
      flex:0.3,
      flexDirection: 'row',
      borderTopColor: '#000',
      borderTopWidth: 4,
  },
  dateBar: {
      flex: 0.1,
      borderTopColor: '#000',
      borderTopWidth: 4,
      padding: 10,
      alignItems: 'center'
  },
  barseparator: {
      borderRightWidth: 4
  },
  barItem: {
      flex: 1,
      padding: 15,
      alignItems: 'center'
  },

  barTop: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
      fontStyle: 'italic'
  },
  barBottom: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold'
  }
});
