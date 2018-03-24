import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';
import { AppRegistry} from 'react-native';
import RepoPage from '/home/yihan/AwesomeProject/app/components/Repositry';
import ProfilePage from '/home/yihan/AwesomeProject/app/components/Profile';
import FollowersPage from '/home/yihan/AwesomeProject/app/components/Followers';
import FollowingPage from '/home/yihan/AwesomeProject/app/components/Following';
import LoginPage from '/home/yihan/AwesomeProject/app/components/Login';
import '/home/yihan/AwesomeProject/ReactotronConfig.js';

const NavigationApp = StackNavigator(
  {
    login:{
      screen: LoginPage,
    },
    profile: {
      screen: ProfilePage,
    },
    repositry: {
      screen: RepoPage,
    },
    followers: {
        screen: FollowersPage,
    },
    following: {
        screen: FollowingPage,
    }
  },
    {headerMode: 'none',
  },
    {footerMode: 'screen',
  },
);

export default class App extends React.Component {
  render() {
    return <NavigationApp />;
    }
 }
