const fs = require('fs');

const dataDir = __dirname + '/../../data';
const messageJSON = fs.readFileSync(dataDir + '/messages.json', 'utf8').toString();
const data = JSON.parse(messageJSON);

let mymessages = '';

const friend = "Lizzie Malcolm";

data.threads.forEach((thread) => {
	thread.messages.forEach((message) => {
		if (message.sender === friend) {
			if (message.message) {
				mymessages += message.message;
			}
		}
	});
});
fs.writeFileSync('./mymessages.txt', mymessages);