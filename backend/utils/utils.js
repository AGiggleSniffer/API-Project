function formatSpots(spotsArray, oneImage) {
	// find avgStarRating
	spotsArray.forEach((ele, i) => {
		const { Reviews, SpotImages } = ele.dataValues;
		if (Reviews) {
			var sum = Reviews.reduce((acc, ele) => {
				const { stars } = ele.dataValues;
				return acc + stars;
			}, 0);
		}

		const mySpot = spotsArray[i].dataValues;
		mySpot.avgStarRating = sum / Reviews.length || 0;
		delete mySpot.Reviews;

		// Only need one Image? aka previewImage
		if (oneImage) previewImage(SpotImages, mySpot);
	});
}

function previewImage(SpotImages, mySpot) {
	if (SpotImages[0]) {
		const [firstImage] = SpotImages;
		var { url } = firstImage.dataValues;
	}
	delete mySpot.SpotImages;
	mySpot.previewImage = url || "no images";
}

module.exports = { formatSpots };
