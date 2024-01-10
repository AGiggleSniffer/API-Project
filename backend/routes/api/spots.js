const router = require("express").Router();
const { Spot, Review, SpotImage, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
// chech production or dev
const { environment } = require("../../config");
const isProduction = environment === "production";

// Middleware helper for Spots authorization
const testAuthorization = async (req, res, next) => {
	const { id: userId } = req.user;
	const { id: spotId } = req.params;
	try {
		const mySpot = await Spot.findByPk(spotId);

		if (!mySpot) throw new Error("Spot couldn't be found");

		const { userId: ownerId } = mySpot;

		if (Number(userId) !== Number(ownerId)) throw new Error("Forbidden");
	} catch (err) {
		return next(err);
	}
	return next();
};

///
/// GET
///

// Get all spots
router.get("/", async (req, res, next) => {
	try {
		const allSpots = await Spot.findAll({
			include: [
				{
					model: Review,
				},
				{
					model: SpotImage,
				},
				{
					model: User,
				},
			],
		});
		return res.json({ Spots: allSpots });
	} catch (err) {
		return next(err);
	}
});

// Get spots by user with authorization
router.get("/current", requireAuth, async (req, res, next) => {
	const { id: userId } = req.user;

	try {
		const mySpots = await Spot.findAll({ where: { userId: userId } });

		return res.json({ Spots: mySpots });
	} catch (err) {
		return next(err);
	}
});

// Get details of spot by id
router.get("/:id", async (req, res, next) => {
	const { id: spotId } = req.params;

	try {
		const spotDetails = await Spot.findByPk(spotId, {
			include: [
				{
					model: Review,
				},
				{
					model: SpotImage,
				},
				{
					model: User,
				},
			],
		});
		if (!spotDetails) {
			throw new Error("Spot couldn't be found");
		}
		return res.json({ spotDetails });
	} catch (err) {
		return next(err);
	}
});

// get all reviews from spot id
router.get("/:id/reviews", async (req, res, next) => {
	const { id: spotId } = req.params;

	try {
		const myReviews = await Review.findAll({ where: { spotId: spotId } });

		if (!myReviews) throw new Error("Spot couldn't be found");

		return res.json({ myReviews });
	} catch (err) {
		return next(err);
	}
});

///
/// POST
///

// Create a spot with authentication
router.post("/", requireAuth, async (req, res, next) => {
	const { id: userId } = req.user;

	const { address, city, state, country, lat, lng, name, description, price } =
		req.body;

	try {
		const newSpot = await Spot.create({
			userId: userId,
			address: address,
			city: city,
			state: state,
			country: country,
			lat: lat,
			lng: lng,
			name: name,
			description: description,
			price: price,
		});
		return res.status(201).json({
			id: userId,
			...newSpot.dataValues,
		});
	} catch (err) {
		return next(err);
	}
});

// Add image to a spot with authentication and authorization
router.post(
	"/:id/images",
	requireAuth,
	testAuthorization,
	async (req, res, next) => {
		const { id: spotId } = req.params;
		const { url, preview } = req.body;

		try {
			await SpotImage.create({
				spotId: spotId,
				url: url,
				preview: preview,
			});
			return res.json({
				id: spotId,
				url: url,
				preview: preview,
			});
		} catch (err) {
			return next(err);
		}
	},
);

// create a spot review requires authentication
router.post("/:id/reviews", requireAuth, async (req, res, next) => {
	const { id: userId } = req.user;
	const { id: spotId } = req.params;
	const { review, stars } = req.body;

	try {
		const [newReview, created] = await Review.findOrCreate({
			where: {
				userId: userId,
				spotId: +spotId,
			},
			defaults: {
				reviewMsg: review,
				stars: stars,
			},
		});

		if (!created) throw new Error("User already has a review for this spot");

		return res.status(201).json({ newReview });
	} catch (err) {
		if (
			err.message === "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed" ||
			err.message ===
				'insert or update on table "Reviews" violates foreign key constraint "Reviews_spotId_fkey"'
		) {
			throw new Error("Spot couldn't be found");
		}
		return next(err);
	}
});

///
/// PUT
///

// Edit a spot with authentication and authorization
router.put("/:id", requireAuth, testAuthorization, async (req, res, next) => {
	const { id: spotId } = req.params;
	const { address, city, state, country, lat, lng, name, description, price } =
		req.body;

	try {
		const updatedSpot = await Spot.update(
			{
				address: address,
				city: city,
				state: state,
				country: country,
				lat: lat,
				lng: lng,
				name: name,
				description: description,
				price: price,
			},
			{
				where: { id: spotId },
				/* ONLY supported for Postgres */
				// will return the results without needing another db query
				returning: true,
				plain: true,
			},
		);
		// check if we are in production or if we have to make a THIRD DB query
		if (!isProduction) {
			updatedSpot.sqlite = await Spot.findByPk(spotId);
		}
		return res.json(updatedSpot.sqlite || updatedSpot[1].dataValues);
	} catch (err) {
		return next(err);
	}
});

///
/// DELETE
///

// delete a spot with authentication and authorization
router.delete(
	"/:id",
	requireAuth,
	testAuthorization,
	async (req, res, next) => {
		const { id: spotId } = req.params;
		const where = { id: spotId };
		try {
			await Spot.destroy({ where });

			return res.json({ message: "Successfully deleted" });
		} catch (err) {
			return next(err);
		}
	},
);

///
/// ERROR HANDLING
///

// spot generic error handler
router.use((err, req, res, next) => {
	if (err.message === "Spot couldn't be found") {
		return res.status(404).json({ message: err.message });
	}

	return next(err);
});

module.exports = router;
