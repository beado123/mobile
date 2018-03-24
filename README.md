This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

An in-progress mobile app that explores your github profile and can follow/unfollow users, start/unstar repositries.

### Login Page
Uses Basic OAuth(username and passwords) to login and interact with github API.

<img src="app/img/IMG_1644.PNG" height="400">

### Profile Page
Shows basic information of the user, including number of followers, following, and repositries, create date.
<img src="app/img/IMG_1645.PNG" height="400">

### Following/Follower Page
* Lists following and followers of the user, can unfollow or follow the list of users.
* When pressing the right button to unfollow the user, the text on the button changes to 'follow'. Pull to refresh the list, the user disappears immediately. Go back to profile page and pull to refresh, number of following decrease by one. 

<img src="app/img/IMG_1646.PNG" height="400">       <img src="app/img/IMG_1640.PNG" height="400">

<img src="app/img/IMG_1656.PNG" height="400">       <img src="app/img/IMG_1657.PNG" height="400">  <img src="app/img/IMG_1658.PNG" height="400">

### Repositry Page
* Lists all the repositries of the user, can star or unstar a repositry.
* When pressing the grey star to start the repositry, the color of star changes to yellow. 

<img src="app/img/IMG_1639.PNG" height="400">   <img src="app/img/IMG_1659.PNG" height="400">

### View Other Users
Can view profile page, followers and following page of users that show up in your followers/following list.
<img src="app/img/IMG_1641.PNG" height="400">  <img src="app/img/IMG_1642.PNG" height="400"> <img src="app/img/IMG_1643.PNG" height="400">
