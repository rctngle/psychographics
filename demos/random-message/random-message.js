let messages;

fetch('/data/messages.json', {
	method: 'get'
}).then((response) => {
	return response.json();
}).then((data) => {
	messages = data;
	console.log(messages);
	showRandomMessage();
	setInterval(showRandomMessage, 2000);
});



function showRandomMessage(){
	const thread = messages.threads[Math.floor(Math.random() * messages.threads.length)];
	const message = thread.messages[Math.floor(Math.random() * thread.messages.length)];

	document.querySelector('#message').textContent = message.message;	

}