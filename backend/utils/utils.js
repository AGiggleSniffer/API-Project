function formatSpots(array, oneImage) {
	// find avgStarRating
	array.forEach((ele, i) => {
		const { Reviews, SpotImages } = ele.dataValues;
		if (Reviews) {
			var sum = Reviews.reduce((acc, ele) => {
				const { stars } = ele.dataValues;
				return acc + stars;
			}, 0);
		}

		const mySpot = array[i].dataValues;
		mySpot.avgStarRating = sum / Reviews.length || 0;
		delete mySpot.Reviews;

		if (oneImage) {
			// Only need one Image
			mySpot.previewImage = SpotImages.SpotImage || "no images";
			delete mySpot.SpotImages;
		}
	});
}

module.exports = { formatSpots };
