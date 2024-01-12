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
        
        // Only need one Image?
		if (oneImage && SpotImages[0]) {
            const [firstImage] = SpotImages;
			var { url } = firstImage.dataValues;
        }
        
        const mySpot = spotsArray[i].dataValues;
        mySpot.previewImage = url || "No Images";
		mySpot.avgStarRating = sum / Reviews.length || 0;
		delete mySpot.Reviews;
        delete mySpot.SpotImages;
	});
}

module.exports = { formatSpots };
