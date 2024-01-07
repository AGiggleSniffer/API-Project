const router = require("express").Router();
const { Spot, Review, SpotImage, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
// chech production or dev
const { environment } = require("../../config");
const isProduction = environment === "production";

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

		res.json({ Spots: allSpots });
	} catch (err) {
		next(err);
	}
});

// Get spots by user
router.get("/current", requireAuth, async (req, res, next) => {
	const { user } = req;

	try {
		const mySpots = await Spot.scope({ method: ["owned", user.id] }).findAll();

		res.json({ Spots: mySpots });
	} catch (err) {
		next(err);
	}
});

// Get details of spot by id
router.get("/:id", async (req, res, next) => {
	const { id: spotId } = req.params;

	try {
		const spotDetails = await Spot.findByPk(spotId);

		if (!spotDetails) {
			throw new Error("Spot couldn't be found");
		}

		res.json({ spotDetails });
	} catch (err) {
		next(err);
	}
});

///
/// POST
///

// Add a spot with validation
router.post("/", requireAuth, async (req, res, next) => {
	const { user } = req;

	const { address, city, state, country, lat, lng, name, description, price } =
		req.body;

	try {
		const newSpot = await Spot.create({
			userId: user.id,
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
			id: user.id,
			...newSpot.dataValues,
		});
	} catch (err) {
		res.status(400);
		err.message = "Bad Request";
		return next(err);
	}
});

router.post("/spots/:id/images", requireAuth, async (req, res, next) => {
	res.json({test: "test"})
})

///
/// PUT
///

// Edit a spot with authentication
router.put("/:id", requireAuth, async (req, res, next) => {
	const { user } = req;
	const { id: spotId } = req.params;
	const { address, city, state, country, lat, lng, name, description, price } =
		req.body;

	try {
		const updatedSpot = await Spot.update(
			{
				userId: user.id,
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
				// will return the results without needing a second query
				returning: true,
				plain: true,
			},
		);

		// check if we are in production or if we have to make a second DB query
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

// delete a spot with authentication and id
router.delete("/:id", requireAuth, async (req, res, next) => {
	const { user } = req;
	const { id: spotId } = req.params;
	const where = { firstName: spotId };

	try {
		const deleted = await Spot.scope({ method: ["owned", user.id] }).destroy(
			where,
		);

		if (!deleted) {
			throw new Error("Spot couldn't be found");
		}

		return res.json({ message: "Successfully deleted" });
	} catch (err) {
		return next(err);
	}
});

/// 
/// ERROR HANDLING
///

// spot generic error handler
router.use((err, req, res, next) => {
	if (err.title === "Authentication required") {
		return res.json({ message: err.message });
	}

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
