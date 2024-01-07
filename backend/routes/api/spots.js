const router = require("express").Router();
const { Spot } = require("../../db/models");
const { ValidationError } = require("sequelize");
const { requireAuth } = require("../../utils/auth");

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
		console.log(err);
		err.message = "Bad Request";
		return next(err);
	}
});

router.delete("/:id", async (req, res) => {});

// spot generic error handler
// router.use((err, req, res, next) => {

// 	const errors = {};
// 	for (let error of err.errors) {
// 		errors[error.path] = error.message;
// 	}

// 	return res.json({
// 		message: err.message,
// 		errors: errors,
// 	});
// });

module.exports = router;
