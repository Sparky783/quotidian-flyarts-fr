export interface User {
    idUser?: number,
    email: string,
    password: string,
    name: string,
    isAdmin: boolean,
    token?: string
}
