"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class spot_images extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			spot_images.belongsTo(models.spots, { foreignKey: "spot_id" });
		}
	}
	spot_images.init(
		{
			spot_id: DataTypes.INTEGER,
			url: DataTypes.STRING,
			preview: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: "spot_images",
		},
	);
	return spot_images;
};
