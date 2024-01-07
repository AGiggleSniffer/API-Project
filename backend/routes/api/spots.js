const router = require("express").Router();
const { Spot } = require("../../db/models");

// Add a spot with validation
router.post("/", async (req, res, next) => {
	const { user } = req;

	if (!user) return res.json({ user: null });

	const { address, city, state, country, lat, lng, name, description, price } =
		req.body;

	// return res.json({ test: req.body });

	try {
		// const newSpot = await Spot.findAll();

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
router.use((err, req, res, next) => {
	const errors = {};
	if (err.errors) {
		err.errors.forEach((element) => {
			const { path, message } = element;
			errors[path] = message;
		});
	}

	return res.json({
		message: err.message,
		errors: errors,
		err,
	});
});

module.exports = router;
