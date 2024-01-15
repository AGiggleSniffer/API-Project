const router = require("express").Router();
const { Spot, Booking, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { formatSpots } = require("../../utils/utils");
// chech production or dev
const { environment } = require("../../config");
const isProduction = environment === "production";

// Middleware helper for Booking authorization
const testAuthorization = async (req, res, next) => {
	const { id: userId } = req.user;
	const { bookingsId } = req.params;

	try {
		const myBooking = await Booking.findByPk(bookingsId);

		if (!myBooking) throw new Error("Booking couldn't be found");

		if (req.method === "DELETE") {
			const { spotId, startDate } = myBooking;
			const { userId: ownerId } = await Spot.findByPk(spotId);

			if (new Date(startDate) < new Date()) {
				throw new Error("Bookings that have been started can't be deleted");
			}

			if (Number(userId) === Number(ownerId)) return next();
		}

		const { userId: ownerId } = myBooking.Spot;

		if (Number(userId) !== Number(ownerId)) throw new Error("Forbidden");
	} catch (err) {
		return next(err);
	}
	return next();
};

///
/// GET
///

// get all bookings for the current user requires authentication
router.get("/current", requireAuth, async (req, res, next) => {
	const { id: userId } = req.user;
	const where = { userId: userId };
	const include = {
		model: Spot,
		attributes: {
			exclude: ["description", "updatedAt", "createdAt"],
		},
		include: SpotImage,
	};

	try {
		const myBookings = await Booking.findAll({ where, include });

		myBookings.forEach((ele) => {
			const { Spot } = ele;

			formatSpots([Spot], true, false);
		});

		return res.json(myBookings);
	} catch (err) {
		return next(err);
	}
});

///
/// PUT
///

router.put(
	"/:bookingsId",
	requireAuth,
	testAuthorization,
	async (req, res, next) => {
		const { startDate, endDate } = req.body;
		const { bookingsId } = req.params;
		const include = {
			model: Spot,
			include: Booking,
		};
		const payload = {
			startDate: startDate,
			endDate: endDate,
		};
		const options = {
			where: { id: bookingsId },
			/* ONLY supported for Postgres */
			// will return the results without needing another db query
			returning: true,
			plain: true,
		};

		try {
			// find Booking with associated spot and all its bookings
			const { Bookings } = await Booking.findByPk(bookingsId, { include }).Spot;

			// Validate Dates dont conflict with any others
			const dates = { startDate, endDate };
			checkConflicts(Bookings, dates);

			// test if booking is for the future
			if (new Date(startDate) <= new Date()) {
				throw new Error("Past bookings can't be modified");
			}

			// Update
			const updatedBooking = await Booking.update(payload, options);

			// check if we are in production or if we have to make another DB query
			if (!isProduction) {
				updatedBooking.sqlite = await Booking.findByPk(bookingsId);
			}

			return res.json(updatedBooking.sqlite || updatedBooking[1].dataValues);
		} catch (err) {
			return next(err);
		}
	},
);

///
/// DELETE
///

router.delete(
	"/:bookingsId",
	requireAuth,
	testAuthorization,
	async (req, res, next) => {
		const { bookingsId } = req.params;
		const where = { id: bookingsId };

		try {
			await Booking.destroy({ where });

			return res.json({ message: "Successfully deleted" });
		} catch (err) {
			return next(err);
		}
	},
);

module.exports = router;
