export interface User {
  idUser?: number,
  email: string,
  password: string,
  name: string,
  status: string,
  isAdmin: boolean,
  token?: string
}
