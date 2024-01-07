"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Spot extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Spot.hasMany(models.Booking, {
				foreignKey: "spotId",
				onDelete: "CASCADE",
				hooks: true,
			});
			Spot.hasMany(models.SpotImage, {
				foreignKey: "spotId",
				onDelete: "CASCADE",
				hooks: true,
			});
			Spot.hasMany(models.Review, {
				foreignKey: "spotId",
				onDelete: "CASCADE",
				hooks: true,
			});
			Spot.belongsTo(models.User, { foreignKey: "userId" });
		}
	}
	Spot.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Street address is required" },
				},
			},
			city: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "City is required" },
				},
			},
			state: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "State is required" },
				},
			},
			country: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Country is required" },
				},
			},
			// -90 through 90
			lat: {
				type: DataTypes.DECIMAL,
				allowNull: false,
				validate: {
					min: {
						args: -90,
						msg: "Latitude is not valid",
					},
					max: {
						args: 90,
						msg: "Latitude is not valid",
					},
				},
			},
			// -180 through 180
			lng: {
				type: DataTypes.DECIMAL,
				validate: {
					min: {
						args: -180,
						msg: "Longitude is not valid",
					},
					max: {
						args: 180,
						msg: "Longitude is not valid",
					},
				},
			},
			name: {
				type: DataTypes.STRING,
				validate: {
					len: {
						args: [0, 50],
						msg: "Name must be less than 50 characters",
					},
				},
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Description is required" },
				},
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "Price per day is required" },
				},
			},
		},
		{
			sequelize,
			modelName: "Spot",
			scopes: {
				owned(userId) {
					return {
						where: {
							userId: userId,
						},
					};
				},
			},
		},
	);
	return Spot;
};
