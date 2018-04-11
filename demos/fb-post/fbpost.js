// https://developers.facebook.com/tools/accesstoken/
// https://developers.facebook.com/tools/explorer

const userToken = "";
const appToken = "";
const accessToken = "";

const FB = require('fb');

FB.setAccessToken(accessToken);
 
var body = 'My first post using facebook-node-sdk';
FB.api('me/feed', 'post', { message: body }, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log('Post Id: ' + res.id);
});