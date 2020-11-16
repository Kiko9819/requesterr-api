import { DataTypes, Sequelize } from "sequelize";
import bcrypt from 'bcrypt';

export default async (sequelize: Sequelize) => {
    const User = sequelize.define(
        'User',
        {
            name: {
                type: DataTypes.STRING
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
        }
    );

    User.prototype.validatePassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

    await User.sync({force: true});

    return User;
}
