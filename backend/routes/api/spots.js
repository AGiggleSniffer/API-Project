const router = require("express").Router();
const { sequelize, Spot, Review, SpotImage, User } = require("../../db/models");
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
		const mySpots = await Spot.findAll({ where: { id: userId } });

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
		res.status(400);
		err.message = "Bad Request";
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

///
/// PUT
///

// Edit a spot with authentication and authorization
router.put("/:id", requireAuth, testAuthorization, async (req, res, next) => {
	const { id: userId } = req.user;
	const { id: spotId } = req.params;
	const { address, city, state, country, lat, lng, name, description, price } =
		req.body;

	try {
		const updatedSpot = await Spot.update(
			{
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
			},
			{
				where: { id: spotId },
				/* ONLY supported for Postgres */
				// will return the results without needing a THIRD query
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
		res.status(400);
		err.message = "Bad Request";
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

	if (err.message === "Bad Request") {
		const errors = {};
		if (err.errors instanceof Array) {
			err.errors.forEach((element) => {
				const { path, message } = element;
				errors[path] = message;
			});
		}
		return res.json({
			message: err.message,
			errors: errors,
			stack: isProduction ? null : err.stack,
		});
	}

	return next(err);
});

module.exports = router;
