import { Inject } from "typedi";

export default class UsersService {
    @Inject('UserModel') private userModel;

    constructor(){}

    public async UpdateUser(id: number, userDTO: any): Promise<any> {
        try {
            const userRecord = await this.userModel.findOne({
                where: {
                    id: id
                }
            });

            if (userRecord) {
                // sets all properties comming from the frontend
                Object.keys(userDTO).forEach(dtoKey => {
                    userRecord[dtoKey] = userDTO[dtoKey];
                })

                userRecord.save();
            }

            return {userRecord};
        } catch(error) {
            throw error;
        }
    }
}