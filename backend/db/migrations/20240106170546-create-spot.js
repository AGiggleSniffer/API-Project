"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			"Spots",
			{
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER,
				},
				userId: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				address: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				city: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				state: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				country: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				lat: {
					type: Sequelize.DECIMAL(2, 7),
					allowNull: false,
				},
				lng: {
					type: Sequelize.DECIMAL(3, 7),
					allowNull: false,
				},
				name: {
					type: Sequelize.STRING(50),
					allowNull: false,
				},
				description: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				price: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
			},
			options,
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Spots");
	},
};
