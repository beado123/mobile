import React from 'react';
import Followers from '/home/yihan/AwesomeProject/app/components/Followers.js';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Followers />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('refreshing state should change', () => {
    let followersComponent = renderer.create(<Followers/>).getInstance();
    followersComponent.handleRefresh();
    expect(followersComponent.state.refreshing).toBe(true);
});
