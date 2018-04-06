const {
	cv,
	getDataFilePath,
	drawBlueRect,
	drawGreenRect
} = require('./utils');


const dataFolder = 'data';
const fs = require('fs');

fs.readdir(dataFolder, (err, files) => {
	files.forEach(file => {
		if(file.indexOf('jpg') !== -1){
			extractEyes(dataFolder, file);
		} else if(file.indexOf('html') === -1){
			fs.readdir(dataFolder+'/'+file, (err, folder) => {
				if(folder !== undefined){
					folder.forEach(image => {
						extractEyes('photos/'+file, image);
					});
				}
			});
		}
	});
})


function extractEyes(folder, filename){
	const image = cv.imread('./'+folder+'/'+filename);

	const faceClassifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);
	const featureClassifier = new cv.CascadeClassifier(cv.HAAR_EYE);
	const faceResult = faceClassifier.detectMultiScale(image.bgrToGray());
	const sortByNumDetections = result => result.numDetections
		.map((num, idx) => ({ num, idx }))
		.sort(((n0, n1) => n1.num - n0.num))
		.map(({ idx }) => idx);

	const faceRect = faceResult.objects[sortByNumDetections(faceResult)[0]];

	faceResult.objects.forEach(function(face, i){
		const faceRegion = image.getRegion(face);
		const featureResult = featureClassifier.detectMultiScale(faceRegion);
		const featureRects = sortByNumDetections(featureResult)
		.slice(0, 2)
		.map(idx => featureResult.objects[idx]);
		featureRects.forEach(function(featureRect, ei){
			cv.imwrite('./output/'+filename.split('.')[0]+'-'+i+'-'+ei+'.jpg', faceRegion.getRegion(featureRect));

		});
	});
}