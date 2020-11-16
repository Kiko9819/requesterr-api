import { Sequelize } from 'sequelize/types';
import Role from '../database/models/role';
import User from '../database/models/user';

export default async (sequelize: Sequelize) => {
    // TODO: Figure out a better way to do this
    const setRelationsShips = (UserModel, RoleModel) => {
        // Creates a join table between the users and the roles
        UserModel.belongsToMany(RoleModel, {
            through: 'UserRoles',
            foreignKey: "userId"
        });

        RoleModel.belongsToMany(UserModel, {
            through: 'UserRoles',
            foreignKey: "roleId"
        });
    }

    const UserModel = await User(sequelize);
    const RoleModel = await Role(sequelize);
    setRelationsShips(UserModel, RoleModel);

    await sequelize.sync({force: true});

    return {
        UserModel,
        RoleModel
    };
}
