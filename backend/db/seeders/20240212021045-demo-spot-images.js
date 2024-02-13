"use strict";

const { SpotImage } = require("../models");

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

		const generateImages = (numOfSpots = 1000) =>
			Array(numOfSpots)
				.fill(null)
				.map((_, i) => {
					const num = randomNum(300000, 100000);
					const url = `https://images.pexels.com/photos/${num}/pexels-photo-${num}.jpeg`;

					return { spotId: i + 1, url: url, preview: true };
				});

		const imageArr = generateImages();

		await SpotImage.bulkCreate(imageArr);
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
