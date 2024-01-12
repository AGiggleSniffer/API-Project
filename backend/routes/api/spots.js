const router = require("express").Router();
const { Op } = require("sequelize");
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { formatSpots } = require("../../utils/utils");
// chech production or dev
const { environment } = require("../../config");
const spot = require("../../db/models/spot");
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
	const include = [
		{
			model: Review,
		},
		{
			model: SpotImage,
		},
	];
	try {
		const Spots = await Spot.findAll({ include });

		// Add avgRating and oneImage is TRUE
		formatSpots(Spots, true);

		return res.json({ Spots });
	} catch (err) {
		return next(err);
	}
});

// Get spots by user with authorization
router.get("/current", requireAuth, async (req, res, next) => {
	const { id: userId } = req.user;
	const where = { userId: userId };
	const include = [
		{
			model: Review,
		},
		{
			model: SpotImage,
		},
	];

	try {
		const mySpots = await Spot.findAll({ where, include });

		// Add avgRating and oneImage is TRUE
		formatSpots(mySpots, true);

		return res.json({ Spots: mySpots });
	} catch (err) {
		return next(err);
	}
});

// Get details of spot by id
router.get("/:id", async (req, res, next) => {
	const { id: spotId } = req.params;
	const include = [
		{
			model: Review,
		},
		{
			model: SpotImage,
		},
		{
			model: User,
		},
	];

	try {
		const spotDetails = await Spot.findByPk(spotId, { include });
		if (!spotDetails) {
			throw new Error("Spot couldn't be found");
		}

		// find num of reviews
		spotDetails.dataValues.numReviews = spotDetails.dataValues.Reviews.length;

		// Add avgRating and oneImage is FALSE
		formatSpots([spotDetails]);

		// change user to owner
		spotDetails.dataValues.Owner = spotDetails.dataValues.User.dataValues;
		delete spotDetails.dataValues.User;

		return res.json(spotDetails);
	} catch (err) {
		return next(err);
	}
});

// get all reviews from spot id
router.get("/:id/reviews", async (req, res, next) => {
	const { id: spotId } = req.params;
	const where = { spotId: spotId };
	const include = [
		{
			model: User,
		},
		{
			model: ReviewImage,
		},
	];

	try {
		const myReviews = await Review.findAll({ where, include });

		if (!myReviews) throw new Error("Spot couldn't be found");

		return res.json({ myReviews });
	} catch (err) {
		return next(err);
	}
});

// get all bookings based on spot ID require authentication
router.get("/:id/bookings", requireAuth, async (req, res, next) => {
	const { id: userId } = req.user;
	const { id: spotId } = req.query;
	const include = {
		model: Booking,
		include: {
			model: User,
		},
	};

	try {
		const mySpot = await Spot.findByPk(spotId, { include });

		if (!mySpot) throw new Error("Spot couldn't be found");

		const { userId: ownerId, Bookings } = mySpot;

		if (ownerId !== userId) {
			Bookings.forEach((ele, i) => {
				const { startDate, endDate } = ele;
				Bookings[i] = { spotId, startDate, endDate };
			});
		}

		return res.json({ Bookings });
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

	const query = {
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
	};

	try {
		const { dataValues } = await Spot.create(query);
		return res.status(201).json({
			id: userId,
			...dataValues,
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
		const query = {
			spotId: spotId,
			url: url,
			preview: preview,
		};

		try {
			const { id } = await SpotImage.create(query);
			return res.json({ id, url, preview });
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
	const where = {
		userId: userId,
		spotId: +spotId,
	};
	const defaults = {
		reviewMsg: review,
		stars: stars,
	};

	try {
		const [newReview, created] = await Review.findOrCreate({
			where,
			defaults,
		});

		if (!created) throw new Error("User already has a review for this spot");

		return res.status(201).json(newReview);
	} catch (err) {
		if (err.message.toLowerCase().includes("foreign key constraint")) {
			throw new Error("Spot couldn't be found");
		}
		return next(err);
	}
});

// Create a booking on spotId require authentication and reverse authorization
router.post("/:id/bookings", requireAuth, async (req, res, next) => {
	const { startDate, endDate } = req.body;
	const { id: spotId } = req.params;
	const { id: userId } = req.user;

	// reverse authorize here still

	try {
		const spotBookings = Booking.findAll({ where: { spotId: spotId } });

		const errors = {};
		spotBookings.forEach((ele) => {
			const { startdate: newStart, endDate: newEnd } = ele;
			if (newStart >= startDate && newStart <= endDate) {
				errors.startDate = "Start date conflicts with an existing booking";
			}

			if (startDate >= newStart && startDate <= newEnd) {
				errors.endDate = "End date conflicts with an existing booking";
			}
		});

		if (errors) throw new Error(errors);

		const newBooking = Booking.create({
			spotId: spotId,
			userId: userId,
			startDate: startDate,
			endDate: endDate,
		});

		return res.json({ newBooking });
	} catch (err) {
		if (err.message.toLowerCase().includes("foreign key constraint")) {
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
	const query = {
		address: address,
		city: city,
		state: state,
		country: country,
		lat: lat,
		lng: lng,
		name: name,
		description: description,
		price: price,
	};
	const options = {
		where: { id: spotId },
		/* ONLY supported for Postgres */
		// will return the results without needing another db query
		returning: true,
		plain: true,
	};

	try {
		const updatedSpot = await Spot.update(query, options);
		// check if we are in production or if we have to make another DB query
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
// router.use((err, req, res, next) => {
// 	if (err.message === "Spot couldn't be found") {
// 		return res.status(404).json({ message: err.message });
// 	}

// 	return next(err);
// });

module.exports = router;
