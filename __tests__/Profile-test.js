import React from 'react';
import Profile from '/home/yihan/AwesomeProject/app/components/Profile.js';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Profile />).toJSON();
  expect(tree).toMatchSnapshot();
});
