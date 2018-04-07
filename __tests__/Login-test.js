import React from 'react';
import "isomorphic-fetch"
import { StackNavigator } from 'react-navigation';
import Login from '/home/yihan/AwesomeProject/app/components/Login.js';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Login />).toJSON();
  expect(tree).toMatchSnapshot();
});
