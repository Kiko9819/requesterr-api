// will be used for User interface
export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    salt: string;
}

export interface IUserInputDTO {
    name: string;
    email: string;
    password: string;
}

export interface IUserCreateResponseDTO {
    user: IUser,
    token: string;
}
