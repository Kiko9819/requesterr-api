import { DataTypes, Sequelize } from 'sequelize';

export default async (sequelize: Sequelize) => {
    const UserToken = sequelize.define(
        'UserToken',
        {
            refreshToken: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }
    );

    UserToken.sync();

    return UserToken;
}
