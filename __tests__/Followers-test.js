import React from 'react';
import Followers from '/home/yihan/AwesomeProject/app/components/Followers.js';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Followers />).toJSON();
  expect(tree).toMatchSnapshot();
});
