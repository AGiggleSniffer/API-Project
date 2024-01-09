const router = require("express").Router();
const { Review, User, Spot, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Middleware helper for Review authorization
const testAuthorization = async (req, res, next) => {
	const { id: userId } = req.user;
	const { id: spotImageId } = req.params;
	try {
		const mySpotImage = await Review.findByPk(spotImageId, {
			include: Spot,
		});

		if (!mySpotImage) throw new Error("Review couldn't be found");

		const { userId: ownerId } = mySpotImage.Spot;

		if (Number(userId) !== Number(ownerId)) throw new Error("Forbidden");
	} catch (err) {
		return next(err);
	}
	return next();
};

router.get("/current", requireAuth, async (req, res, next) => {
	const { id: userId } = req.user;

	try {
		const myReviews = await Review.findAll({ where: { userId: userId } });

		res.json({ myReviews });
	} catch (err) {
		return next(err);
	}
});

// Error handling
router.use((err, req, res, next) => {
	if (err.message === "Review couldn't be found") {
		return res.status(404).json({ message: err.message });
	}
	return next(err);
});

module.exports = router;
