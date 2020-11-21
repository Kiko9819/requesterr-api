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

    await Role.sync({ force: true });

    return Role;
}
