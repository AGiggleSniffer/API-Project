"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Review extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Review.hasMany(models.ReviewImage, {
				foreignKey: "reviewId",
				onDelete: "CASCADE",
				hooks: true,
			});
			Review.belongsTo(models.User, { foreignKey: "userId" });
			Review.belongsTo(models.Spot, { foreignKey: "spotId" });
		}
	}
	Review.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				onDelete: "CASCADE",
			},
			spotId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				onDelete: "CASCADE",
			},
			reviewMsg: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Review text is required" },
					notEmpty: { msg: "Review text is required" },
				},
			},
			stars: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "Stars must be an integer from 1 to 5" },
					min: {
						args: 1,
						msg: "Stars must be an integer from 1 to 5",
					},
					max: {
						args: 5,
						msg: "Stars must be an integer from 1 to 5",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "Review",
			indexes: [
				{
					unique: true,
					fields: ["userId", "spotId"],
					msg: "User already has a review for this spot",
				},
			],
		},
	);
	return Review;
};
