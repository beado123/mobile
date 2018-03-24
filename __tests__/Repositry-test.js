import React from 'react';
import Repositry from '/home/yihan/AwesomeProject/app/components/Repositry.js';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Repositry />).toJSON();
  expect(tree).toMatchSnapshot();
});
