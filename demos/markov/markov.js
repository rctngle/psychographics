const fs = require('fs');
const Text = require('markov-chains-text').default;

const dataDir = __dirname + '/../../data';
const messageJSON = fs.readFileSync(dataDir + '/messages.json', 'utf8').toString();
const data = JSON.parse(messageJSON);


const sentences = [];

const friend = "Daniel Powers";

data.forEach((thread) => {
	thread.conversation.forEach((messages) => {
		if (messages.user === friend) {
			messages.messages.forEach((message) => {
				if (message.text) {
					sentences.push(message.text);
				}
			});
		}
	});
});

const text = sentences.join('. ');
const fakeFriend = new Text(text);

const fakeSentences = [];
for (let i=0; i<1000; i++) {
	try {
		const sentence = fakeFriend.makeSentence();
		if (sentence) {
			console.log(sentence);
			fakeSentences.push(sentence.trim());
		}
	} catch(e) {

	}
}

fs.writeFileSync('./sentences.json', JSON.stringify(fakeSentences));