import React from 'react';
import "isomorphic-fetch"
import Profile from '/home/yihan/AwesomeProject/app/components/Profile.js';
import renderer from 'react-test-renderer';

var num_followers = -1;
var num_following = -1;
test('renders correctly', () => {
  const tree = renderer.create(<Profile />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('the user data is of correct type', async () => {
    const XMLHttpRequest = require('xhr2');
    global.XMLHttpRequest = XMLHttpRequest;
    let profileComponent = renderer.create(<Profile/>).getInstance();
    return profileComponent.fetchDataFromAPI('beado123','', 'beado123', '62524391a/').then(data => {
        expect(data.type).toBe('User');
        num_followers = data.followers;
        num_following = data.following;
    });
});

test('get number of following correctly', async () => {
    const XMLHttpRequest = require('xhr2');
    global.XMLHttpRequest = XMLHttpRequest;
    let profileComponent = renderer.create(<Profile/>).getInstance();
    return profileComponent.fetchDataFromAPI('beado123','/following', 'beado123', '62524391a/').then(data => {
        expect(data.length).toBe(num_following);
    });
});

test('get number of followers correctly', async () => {
    const XMLHttpRequest = require('xhr2');
    global.XMLHttpRequest = XMLHttpRequest;
    let profileComponent = renderer.create(<Profile/>).getInstance();
    return profileComponent.fetchDataFromAPI('beado123','/followers', 'beado123', '62524391a/').then(data => {
        expect(data.length).toBe(num_followers);
    });
});

test('refreshing state should change', () => {
    let profileComponent = renderer.create(<Profile/>).getInstance();
    profileComponent._onRefresh();
    expect(profileComponent.state.refreshing).toBe(true);
});
