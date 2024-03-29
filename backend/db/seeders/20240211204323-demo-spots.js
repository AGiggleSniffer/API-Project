"use strict";

const { Spot } = require("../models");
const { states, cities, streets } = require("../randomData.js");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

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

		const buildSpots = (numOfSpots = 100) =>
			Array(numOfSpots)
				.fill(null)
				.map(() => ({
					ownerId: randomNum(3),
					address: `${randomNum(999)} ${streets[randomNum(streets.length)]}`,
					city: `${cities[randomNum(cities.length)]}`,
					state: `${states[randomNum(states.length)]}`,
					country: "USA",
					lat: randomNum(90),
					lng: randomNum(180),
					name: "Demo Spot",
					description: "A Nice Place",
					price: randomNum(10000),
				}));

		const demoSpotsArr = buildSpots();

		await Spot.bulkCreate(demoSpotsArr);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		options.tableName = "Spots";
		return queryInterface.bulkDelete(options, { name: "Demo Spot" });
	},
};
