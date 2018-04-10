const poemGen = require('poem-gen');

poemGen('./facebook.txt', { 
	repeats: 2,
	scheme: 'limerick',
}, (poem) => {
	poem.lines.forEach((words) => {
		const line = words.join(' ');
		console.log(line);
	});
});