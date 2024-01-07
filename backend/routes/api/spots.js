const router = require("express").Router();
const { Spot } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
// chech production or dev
const { environment } = require("../../config");
const isProduction = environment === "production";

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

router.delete("/:id", async (req, res) => {});

// spot generic error handler
router.use((err, req, res, next) => {
	if (err.title === "Authentication required") {
		return res.json({ message: err.message });
	}

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
});

module.exports = router;
