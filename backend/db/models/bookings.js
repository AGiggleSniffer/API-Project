"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class bookings extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			bookings.belongsTo(models.User, { foreignKey: "user_id" });
			bookings.belongsTo(models.spots, { foreignKey: "spot_id" });
		}
	}
	bookings.init(
		{
			user_id: DataTypes.INTEGER,
			spot_id: DataTypes.INTEGER,
			start_date: DataTypes.DATE,
			end_date: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "bookings",
		},
	);
	return bookings;
};
