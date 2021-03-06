import { Sequelize } from 'sequelize/types';
import Role from '../database/models/role';
import User from '../database/models/user';

export default async (sequelize: Sequelize) => {
    // TODO: Figure out a better way to do this
    const setRelationsShips = async (UserModel, RoleModel) => {
        // Creates a join table between the users and the roles
        await UserModel.belongsToMany(RoleModel, {
            through: 'UserRoles',
            foreignKey: "userId"
        });

        await RoleModel.belongsToMany(UserModel, {
            through: 'UserRoles',
            foreignKey: "roleId"
        });
    }
    // TODO: use sequelizes seeders
    const seedDb = async (UserModel, RoleModel) => {
        await RoleModel.create({
            name: "ADMIN",
            description: "Is god like"
        })
        await RoleModel.create({
            name: "USER",
            description: "Is not so god like"
        })
        await UserModel.create({
            name: "admin",
            email: "admin@admin.com",
            password: "admin"
        });
    }

    const forceSync = async () => {
        await sequelize.query('SET FOREIGN_KEY_CHECKS=0');
        await sequelize.sync({force: true});
        await sequelize.query('SET FOREIGN_KEY_CHECKS=1');
    }

    const UserModel = await User(sequelize);
    const RoleModel = await Role(sequelize);
    await setRelationsShips(UserModel, RoleModel);
    await forceSync();
    
    await seedDb(UserModel, RoleModel);

    return {
        UserModel,
        RoleModel
    };
}
