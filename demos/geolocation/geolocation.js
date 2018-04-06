const https = require("http");

const ip = '72.229.28.185';
let url = 'http://ip-api.com/json/'+ip;


https.get(url, res => {
	res.setEncoding("utf8");	
	res.on("data", data => {
		console.log(data); 	
		
 	}); 	
});

