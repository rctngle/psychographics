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
	const idx = Math.floor(Math.random() * messages.length);
	const message = messages[idx];
	const cidx = Math.floor(Math.random() * message.conversation.length);
	if(message.conversation.length === 0){
		showRandomMessage();
	} else {
		const midx = Math.floor(Math.random() * message.conversation[cidx].messages.length);
		if(message.conversation[cidx].messages.length !== 0){
			document.querySelector('#message').textContent = message.conversation[cidx].messages[midx].text;	
		}		
	}	
}