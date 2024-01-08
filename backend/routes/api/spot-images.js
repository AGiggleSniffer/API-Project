const router = require("express").Router();
const { Spot, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Middleware helper for SpotImage authorization
const testAuthorization = async (req, res, next) => {
	const { id: userId } = req.user;
	const { id: spotImageId } = req.params;
	try {
		const mySpotImage = await SpotImage.findByPk(spotImageId, {
			include: Spot,
		});

		if (!mySpotImage) throw new Error("Spot couldn't be found");

		const { userId: ownerId } = mySpotImage.Spot;

		if (Number(userId) !== Number(ownerId)) throw new Error("Forbidden");
	} catch (err) {
		return next(err);
	}
	return next();
};

// Delete a spot image require authentication and authorization
router.delete(
	"/:id",
	requireAuth,
	testAuthorization,
	async (req, res, next) => {
		const { id: spotImageId } = req.params;
		const where = { id: spotImageId };
		try {
			await SpotImage.destroy({ where });

			return res.json({ message: "Successfully deleted" });
		} catch (err) {
			return next(err);
		}
	},
);

// Error handling
router.use((err, req, res, next) => {
	if (err.message === "Spot couldn't be found") {
		return res.status(404).json({ message: err.message });
	}
	return next(err);
});

module.exports = router;
