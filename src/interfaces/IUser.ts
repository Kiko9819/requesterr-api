// will be used for User interface
export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface IUserLoginDTO {
    email: string;
    password: string;
}

export interface IUserInputDTO {
    name: string;
    email: string;
    password: string;
    roleId?: number; // TODO make array of ids(for each role)
}

export interface IUserCreateResponseDTO {
    user: IUser;
}
