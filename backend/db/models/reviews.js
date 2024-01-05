"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class reviews extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			reviews.hasMany(models.review_images, {
				foreignKey: "review_id",
				onDelete: "CASCADE",
				hooks: true,
			});
			reviews.belongsTo(models.User, { foreignKey: "user_id" });
			reviews.belongsTo(models.spots, { foreignKey: "spot_id" });
		}
	}
	reviews.init(
		{
			user_id: DataTypes.INTEGER,
			spot_id: DataTypes.INTEGER,
			review: DataTypes.STRING,
			stars: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "reviews",
		},
	);
	return reviews;
};
