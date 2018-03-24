import React from 'react';
import Following from '/home/yihan/AwesomeProject/app/components/Following.js';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Following />).toJSON();
  expect(tree).toMatchSnapshot();
});
