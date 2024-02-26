"use strict";

const { Review } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		const randomNum = (max, min) =>
			Math.floor(min + (max - min) * Math.random());

		const generateReviews = (numOfSpots = 100) =>
			Array(numOfSpots)
				.fill(null)
				.map((_, i) => {
					const msg =
						"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
					const stars = randomNum(5, 1);
					const userId = randomNum(3, 1);
					return { spotId: i + 1, userId: userId, review: msg, stars: stars };
				});

		const reviewsPerSpot = 20;
		for (let i = 0; i < reviewsPerSpot; i++) {
			const reviewArr = generateReviews();
			await Review.bulkCreate(reviewArr);
		}
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
