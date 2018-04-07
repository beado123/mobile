import React from 'react';
import Notifications from '/home/yihan/AwesomeProject/app/components/Notifications.js';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Notifications />).toJSON();
  expect(tree).toMatchSnapshot();
});
