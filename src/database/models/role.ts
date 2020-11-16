import { DataTypes, Sequelize } from 'sequelize';

export default async (sequelize: Sequelize) => {
    const Role = sequelize.define(
        'Role',
        {
            name: {
                type: DataTypes.STRING
            },
            description: {
                type: DataTypes.STRING
            },
        }
    );

    await Role.sync({force: true});

    return Role;
}
