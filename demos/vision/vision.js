// GOOGLE_APPLICATION_CREDENTIALS=/path/to/file node vision

const fs = require('fs');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const images = [];


function processImage() {
	if (images.length > 0) {
		const image = images.shift();
		console.log(image);
		client.labelDetection('./images/' + image).then(results => {
			fs.writeFileSync('./images/' + image + '.json', JSON.stringify(results));
			processImage();
		}).catch(err => {
			console.error('ERROR:', err);
		});
	}
}

const idx = 0;
const files = fs.readdirSync('./images');
files.forEach((file) => {
	const filename = file + '.json';
	if (file.indexOf('.json') < 0 && !fs.existsSync('./images/' + filename)) {
		images.push(file);		
	}
});

processImage();
