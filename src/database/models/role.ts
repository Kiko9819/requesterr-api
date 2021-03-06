import { Model } from 'mongoose';
import { DataTypes, Sequelize } from 'sequelize';

export default async (sequelize: Sequelize) => {
    const Role = sequelize.define(
        'Role',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
    );

    Role.sync();

    return Role;
}
