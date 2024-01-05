"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class review_images extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			review_images.belongsTo(models.reviews, { foreignKey: "review_id" });
		}
	}
	review_images.init(
		{
			review_id: DataTypes.INTEGER,
			url: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "review_images",
		},
	);
	return review_images;
};
