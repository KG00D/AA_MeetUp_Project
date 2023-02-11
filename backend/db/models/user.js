'use strict';
const { Model, Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        validatePassword(password) {
            return bcrypt.compareSync(password, this.hashedPassword.toString());
        }
        toSafeObject() {
            const { id, firstName, lastName, username, email } = this; // context will be the User instance
            return { id, firstName, lastName, username, email };
        }
        static associate(models) {
            // define association here

            // Spots owned by user
            User.hasMany(models.Spot, {
                foreignKey: 'ownerId',
                onDelete: 'CASCADE',
                hooks: true,
            });

            // Reviews made by user
            User.belongsToMany(models.Spot, {
                foreignKey: 'userId',
                through: models.Review,
                as: 'Spot_Review',
            });

            // test stuff
            User.hasMany(models.Review, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                hooks: true,
            });

            // Bookings made by user
            User.belongsToMany(models.Spot, {
                through: models.Booking,
                foreignKey: 'userId',
                as: 'Spot_Booking',
            });
            User.hasMany(models.Booking, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                hooks: true,
            });
        }
        static getCurrentUserById(id) {
            return User.scope('currentUser').findByPk(id);
        }
        static async login({ credential, password }) {
            const { Op } = require('sequelize');
            const user = await User.scope('loginUser').findOne({
                where: {
                    [Op.or]: {
                        username: credential,
                        email: credential,
                    },
                },
            });
            if (user && user.validatePassword(password)) {
                return await User.scope('currentUser').findByPk(user.id);
            }
        }
        static async signup({
            username,
            email,
            password,
            firstName,
            lastName,
        }) {
            const hashedPassword = bcrypt.hashSync(password);
            const user = await User.create({
                username,
                email,
                hashedPassword,
                firstName,
                lastName,
            });
            return await User.scope('currentUser').findByPk(user.id);
        }
    }

    User.init(
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 30],
                },
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 30],
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 256],
                    isEmail: true,
                },
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [4, 30],
                    isNotEmail(value) {
                        if (Validator.isEmail(value)) {
                            throw new Error('Cannot be an email.');
                        }
                    },
                },
            },
            hashedPassword: {
                type: DataTypes.STRING.BINARY,
                allowNull: false,
                validate: {
                    len: [60, 60],
                },
            },
        },
        {
            sequelize,
            modelName: 'User',
            defaultScope: {
                attributes: {
                    exclude: [
                        'hashedPassword',
                        'email',
                        'createdAt',
                        'updatedAt',
                    ],
                },
            },
            scopes: {
                currentUser: {
                    attributes: {
                        exclude: ['hashedPassword', 'createdAt', 'updatedAt'],
                    },
                },
                loginUser: {
                    attributes: {},
                },
            },
        }
    );
    return User;
};