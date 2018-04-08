fetch('sentences.json', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then((data) => {
	data.forEach((sentence, i) => {		
		const li = document.createElement('li');
	
		li.innerHTML = `
			<span class="score">${sentence.sentiment}</span>
			<span class="sentence">${sentence.text}</span>
		`;

		document.querySelector('#sentences').appendChild(li);

	});
	var options = {
	    valueNames: [ 'score', 'sentence' ]
	};
	var list = new List('sentences-container', options);

});
