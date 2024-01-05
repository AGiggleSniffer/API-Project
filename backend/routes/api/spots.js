const router = require("express").Router();

// Add a spot with validation
router.post("/", async (req, res) => {
	const { user } = req;
	if (user) {
		const safeUser = {
			id: user.id,
			email: user.email,
			username: user.username,
		};
		return res.json({
			user: safeUser,
		});
	} else return res.json({ user: null });
});

module.exports = router;
