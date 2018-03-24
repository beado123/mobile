renderHeader = () => {
       return (<View style={styles.header}>
           <Text style={styles.headerText}>-repositries-</Text>
       </View>);
   };
header: {
    backgroundColor: '#64678f',
    justifyContent: 'center',
    alignItems: 'center',
    height:30
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    //padding: 26
  },

<TouchableOpacity onPress={() => this.props.navigation.navigate('profile',{name: this.state.username,
                                                                                                            psw: this.state.psw})} style={styleLogin.buttonLogin}>
                                    <Text style={styleLogin.buttonText}>LOGIN</Text>
                                </TouchableOpacity>

<View style={styleBar.dateBar}>

                </View>

const response = await fetch('https://api.github.com/users/'+login+'/following');
const myJson = await response.json();
this.setState({data: myJson,refreshing: false})
console.log(myJson);

fetch('http://api.github.com/user/starred/'+this.state.user+'/'+repoName ,{
            method: 'GET',
            headers: {
              'Authorization': "token 3c750797f0be64c680ac8b1c64591d15d5f3235a",
            },
})
.then(res => {
    if(res.status == 204){
        console.log(repoName);
        console.log('is starring');
        return 'starring';

    }
    else if(res.status == 404){
        console.log(repoName);
        console.log('not starring');
        return 'unstarred';

    }
}).catch((error) =>{
    console.error(error);
});
renderRightButton = () => {
console.log('here');
return(<Text style={{color: '#fff', fontSize: 10}}>star</Text>);
}

fetch('http://api.github.com/users/'+login+'/following')
.then(res => res.json())
  .then(res => {
      console.log(res.length);
    this.setState({data: res || [], refreshing: false})
    AsyncStorage.setItem('following', JSON.stringify(res));
  }).catch((error) =>{
    console.error(error);
  });

{this.state.login!='beado123' && <TouchableOpacity onPress = {() => this.changeFollowStatus()}>
    <Text style={styleHeader.button}>{this.renderfollowText()}</Text>
</TouchableOpacity>}

const userInfo = await fetch('http://api.github.com/users/'+login);
const userJson = await userInfo.json();
const following = await fetch('http://api.github.com/users/'+login+'/following');
        const followingJson = await following.json();
const followers = await fetch('http://api.github.com/users/'+login+'/followers');
        const followersJson = await followers.json();

describe("Profile", function () {

  beforeEach(function() {
    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({ok: true, Id: '123'}));
  });

  it("fetchDataFromAPI", function () {

    Profile.fetchDataFromAPI('beado123', '').then(response => {
      console.log(response); //< this is never printed
      expect(response.type).toBe('User'); //< always pass / gets ignored?
    });

  });
});

test('the data is peanut butter', async () => {
    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({ok: true, Id: '123'}));


  expect.assertions(1);
  let profileComponent = renderer.create(<Profile/>).getInstance();
  return profileComponent.fetchData().then(data => {
    expect(data.type).toBe('User');
  });

});

