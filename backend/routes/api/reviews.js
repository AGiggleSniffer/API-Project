const router = require("express").Router();
const { Review, User, Spot, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
// chech production or dev
const { environment } = require("../../config");
const isProduction = environment === "production";

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

///
/// GET
///

router.get("/current", requireAuth, async (req, res, next) => {
	const { id: userId } = req.user;

	try {
		const myReviews = await Review.findAll({ where: { userId: userId } });

		res.json({ myReviews });
	} catch (err) {
		return next(err);
	}
});

///
/// POST
///

// Add an image to a review with authentication and authorization
router.post(
	"/:reviewId/images",
	requireAuth,
	testAuthorization,
	async (req, res, next) => {
		const { url } = req.body;
		const { reviewId } = req.params;

		try {
			const limit = await Review.count({ where: { reviewId: reviewId } });

			if (limit >= 10) {
				throw new Error(
					"Maximum number of images for this resource was reached",
				);
			}

			const newReviewImage = await Review.create({
				reviewId: reviewId,
				url: url,
			});

			return res.json({ newReviewImage });
		} catch (err) {
			return next(err);
		}
	},
);

///
/// PUT
///

// edit a review with authentication and authorization
router.put(
	"/:reviewId",
	requireAuth,
	testAuthorization,
	async (req, res, next) => {
		const { review, stars } = req.body;
		const { reviewId } = req.params;

		try {
			const updatedReview = await Review.update(
				{
					reviewMsg: review,
					stars: stars,
				},
				{
					where: { reviewId: reviewId },
					/* ONLY supported for Postgres */
					// will return the results without needing another db query
					returning: true,
					plain: true,
				},
			);

			// check if we are in production or if we have to make another DB query
			if (!isProduction) {
				updatedReview.sqlite = await Review.findByPk(reviewId);
			}

			return res.json(updatedReview.sqlite || updatedReview[1].dataValues);
		} catch (err) {
			return next(err);
		}
	},
);

///
/// ERROR HANDLING
///

// Error handling
router.use((err, req, res, next) => {
	if (err.message === "Review couldn't be found") {
		return res.status(404).json({ message: err.message });
	}
	return next(err);
});

module.exports = router;
