const fs = require('fs');
const natural = require('natural');

var Analyzer = require('natural').SentimentAnalyzer;
var stemmer = require('natural').PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn")

const sentenceTokenizer = new natural.SentenceTokenizer();
const wordTokenizer = new natural.WordTokenizer();

const dataDir = __dirname + '/../../data';
const messageJSON = fs.readFileSync(dataDir + '/messages.json', 'utf8').toString();
const data = JSON.parse(messageJSON);

const sentences = [];

data.threads.forEach((thread) => {
	thread.messages.forEach((message) => {
		if (message.message) {
			try {
				const messageSentences = sentenceTokenizer.tokenize(message.message);	
				messageSentences.forEach((msgSentence) => {
					sentences.push({ text: msgSentence });
				});	
			} catch(e) {

			}
		}
	});
});

function compare(a,b) {
  if (a.sentiment < b.sentiment)
    return -1;
  if (a.sentiment > b.sentiment)
    return 1;
  return 0;
}



sentences.forEach((sentence) => {
	const words = wordTokenizer.tokenize(sentence.text);	
	sentence.sentiment = analyzer.getSentiment(words);

});

sentences.sort(compare);

fs.writeFileSync('./sentences.json', JSON.stringify(sentences));
