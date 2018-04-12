const fs = require('fs');
const express = require('express');
const app = express();
const moment = require('moment');
const EOL = require('os').EOL;

const mailsDir = '';

function dateSort(a, b) {
	if (a.timestamp === b.timestamp) {
		return 0;
	}

	return a.timestamp < b.timestamp ? -1 : 1;
}

function getFiles(since) {
	
	const files = fs.readdirSync(mailsDir);

	const news = [];
	files.forEach((file, i) => {
			if (file.indexOf('Alerte') >= 0) {
			const dateStr = file.split('- ').pop();
			const m = moment(dateStr, 'MMMM D, YYYY at hh/mmA')
			const timestamp = parseInt(m.format('X'));

			if (timestamp > since) {
				const contents = fs.readFileSync(mailsDir + '/' + file, 'utf8').toString();
				const topic = contents.match(/Alerte Google – (.*)\n/i)[1].trim();
				const messageBody = contents.match(/message:([\s\S]+)/mi)[1];
				
				const headlines = messageBody.match(/^\s{4}(\w.*)$/gmi);
				const messages = messageBody.match(/^(\w.*)$/gmi);
			
				for (let i=0; i<Math.min(headlines.length, messages.length); i++) {
					
					const headline = headlines[i].trim();
					const blurb = messages[i].trim();

					news.push({
						date: dateStr,
						timestamp: timestamp,
						topic: topic,
						headline: headline,
						blurb: blurb,
					});
				}		
			}
		}
	});

	news.sort(dateSort);

	return news;
}


app.get('/', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	res.json({ news: getFiles(parseInt(req.query.since)) });
});

app.listen(3000, () => console.log('Example app listening on port 3000!')); 
