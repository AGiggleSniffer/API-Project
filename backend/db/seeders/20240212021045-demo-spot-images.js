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
		const randomNum = (max) => Math.ceil((max - 1) * Math.random());

		const generateImages = (numOfSpots = 20) =>
			Array(numOfSpots)
				.fill(null)
				.map((spot, i) => {
					const num = randomNum(300000);
					const url = `https://images.pexels.com/photos/${num}/pexels-photo-${num}.jpeg`;

					return spot = { spotId: i + 1, url: url, preview: true };
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
