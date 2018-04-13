// https://developers.facebook.com/tools/accesstoken/
// https://developers.facebook.com/tools/explorer
// control + C to stop
// https://rectangle.design/dev/facebook/

const FB = require('fb');
const fs = require('fs');
const EOL = require('os').EOL;

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(cors())

const accessToken = "";
FB.setAccessToken(accessToken);


const postToFb = false;

function createPost(body) {
	fs.appendFileSync('posts.txt', body+EOL);

	if (postToFb) {
		FB.api('me/feed', 'post', { message: body }, function (res) {
			if(!res || res.error) {
				console.log(!res ? 'error occurred' : res.error);
				return;
			}
			console.log('Post Id: ' + res.id);
		});
	}
}


app.post('/post', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	
	createPost(req.body.post);
	res.json({ success: 1 });
});

app.get('/num-posts', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	
	let i;
	let count = 0;
	fs.createReadStream('posts.txt').on('error', (e) => {
		console.log(e);
	}).on('data', (chunk) => {
		for (i=0; i < chunk.length; ++i)  {
			if (chunk[i] == 10) count++;
		}
	}).on('end', () => {
		res.json({ numPosts: count });
	});
});

app.listen(3000, () => console.log('Example app listening on port 3000!')); 
