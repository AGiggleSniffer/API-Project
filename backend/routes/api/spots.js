const router = require("express").Router();
const { Spot } = require("../../db/models");

// Add a spot with validation
router.post("/", async (req, res, next) => {
	const { user } = req;

	if (!user) return res.json({ user: null });

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

		res.status(201);

		return res.json({
			id: user.id,
			...newSpot.dataValues,
		});
	} catch (e) {
		res.status(400);
		e.message = "Bad Request";
		return next(e);
	}
});

router.delete("/:id", async (req, res) => {});

// chech production or dev
const { environment } = require("../../config");
const isProduction = environment === "production";
// spot generic error handler
router.use((err, req, res, next) => {
	// if (!isProduction) return res.json({ err });

	const errors = {};
	err.errors.forEach((element) => {
		const { path, message } = element;
		errors[path] = message;
	});

	return res.json({
		message: err.message,
		errors: errors,
		err
	});
});

module.exports = router;
