"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class spots extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			spots.hasMany(models.bookings, {
				foreignKey: "spot_id",
				onDelete: "CASCADE",
				hooks: true,
			});
			spots.hasMany(models.spot_images, {
				foreignKey: "spot_id",
				onDelete: "CASCADE",
				hooks: true,
			});
			spots.belongsTo(models.User, { foreignKey: "user_id" });
		}
	}
	spots.init(
		{
			user_id: DataTypes.INTEGER,
			address: DataTypes.STRING,
			city: DataTypes.STRING,
			country: DataTypes.STRING,
			lat: DataTypes.DECIMAL,
			lng: DataTypes.DECIMAL,
			name: DataTypes.STRING,
			description: DataTypes.STRING,
			price: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "spots",
		},
	);
	return spots;
};
