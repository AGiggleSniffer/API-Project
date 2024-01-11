const router = require("express").Router();
const { Review, Spot, Booking } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Middleware helper for Review authorization
const testAuthorization = async (req, res, next) => {
	const { id: userId } = req.user;
	const { id: spotImageId } = req.params;
	const include = { include: Spot };

	try {
		const mySpotImage = await Review.findByPk(spotImageId, include);

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

// get all bookings for the current user requires authentication
router.get("/bookings/current", requireAuth, async (req, res, next) => {
	const { id: userId } = req.user;
	const where = { userId: userId };
	const include = { model: Spot };

	try {
		const myBookings = await Booking.findAll({ where, include });

		return res.json({ myBookings });
	} catch (err) {
		return next(err);
	}
});

///
/// ERROR HANDLING
///

module.exports = router;