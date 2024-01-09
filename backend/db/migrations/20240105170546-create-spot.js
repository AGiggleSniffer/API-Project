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
					references: { model: "Users" },
					onDelete: "CASCADE",
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
					type: Sequelize.DECIMAL,
					allowNull: false,
				},
				lng: {
					type: Sequelize.DECIMAL,
					allowNull: false,
				},
				name: {
					type: Sequelize.STRING,
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
		options.tableName = "Spots";
		await queryInterface.dropTable(options, "Spots");
	},
};
