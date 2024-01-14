function formatSpots(spotsArray, oneImage = false, rateSpot = true) {
	// loop through array
	spotsArray.forEach((ele, i) => {
		const { Reviews, SpotImages } = ele.dataValues;
		const mySpot = spotsArray[i].dataValues;

		console.log(ele);

		// need avgStarRating?
		if (rateSpot) avgStarRating(Reviews, mySpot);

		// Only need one Image? aka previewImage
		if (oneImage) previewImage(SpotImages, mySpot);
	});
}

function avgStarRating(Reviews, mySpot) {
	if (Reviews) {
		var sum = Reviews.reduce((acc, ele) => {
			const { stars } = ele.dataValues;
			return acc + stars;
		}, 0);
	}
	mySpot.avgStarRating = sum / Reviews.length || 0;
	delete mySpot.Reviews;
}

function previewImage(SpotImages, mySpot) {
	if (SpotImages[0]) {
		const [firstImage] = SpotImages;
		var { url } = firstImage.dataValues;
	}
	mySpot.previewImage = url || "no images";
	delete mySpot.SpotImages;
}

module.exports = { formatSpots };
