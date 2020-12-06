import { DataTypes, Sequelize } from "sequelize";
import bcrypt from 'bcrypt';

export default async (sequelize: Sequelize) => {
    const Model = sequelize.define(
        'User',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                set(value) {
                    const hash = bcrypt.hashSync(value, bcrypt.genSaltSync(10));
                    this.setDataValue('password', hash);
                }
            }
        },
        {
            hooks: {
                beforeCreate: (user: any, payload) => {
                    if (!user.roleId) {
                        user.roleId = 2;
                    }
                },
                afterCreate: (user: any, payload) => {
                    sequelize.models.UserRoles.create({
                        userId: user.id,
                        roleId: user.roleId
                    })
                }
            }
        }
    );

    Model.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());

        delete values.password;

        return values;
    }

    await Model.sync({ force: true });

    return Model;
}
