import React from 'react';
import Repositry from '/home/yihan/AwesomeProject/app/components/Repository.js';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Repositry />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('refreshing state should change', () => {
    let repoComponent = renderer.create(<Repositry/>).getInstance();
    repoComponent.handleRefresh();
    expect(repoComponent.state.refreshing).toBe(false);
});
