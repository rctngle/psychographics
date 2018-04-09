const fs = require('fs');
const unique = require('array-unique');

const natural = require('natural');
const sentenceTokenizer = new natural.SentenceTokenizer();

const dataDir = __dirname + '/../../data';
const messageJSON = fs.readFileSync(dataDir + '/messages.json', 'utf8').toString();
const data = JSON.parse(messageJSON);

const ignore = [ 'OK', 'FB', 'NL']; // dont count these...no need put single letter words here.

const yellingPeople = {};

data.threads.forEach((thread) => {
	thread.messages.forEach((message) => {

		try {
			const messageSentences = sentenceTokenizer.tokenize(message.message);	
			messageSentences.forEach((msgSentence) => {
				const capWords = msgSentence.match(/\b[A-Z]+\b/g);
				const validCapWords = [];
				
				capWords.forEach((word) => {
					if (ignore.indexOf(word) < 0 && word.length > 1) {
						validCapWords.push(word);
					}
				});

				if (validCapWords.length > 0) {
					if (!yellingPeople[message.sender]) {
						yellingPeople[message.sender] = [];
					}
					yellingPeople[message.sender].push(msgSentence);
				}
			});	
		} catch(e) {

		}
	});
});

const yellers = []
for (let name in yellingPeople) {
	yellers.push({
		sender: name,
		yells: yellingPeople[name]
	});
}

fs.writeFileSync('./yellers.json', JSON.stringify(yellers));