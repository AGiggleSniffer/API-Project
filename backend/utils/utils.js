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

		// Only need one Image?
		if (oneImage && SpotImages[0]) {
			const [firstImage] = SpotImages;
			const { url } = firstImage.dataValues;
			mySpot.previewImage = url;
			delete mySpot.SpotImages;
		}
	});
}

module.exports = { formatSpots };
