import userModel, { ICreateUser, IUser } from "../../models/user";
import { captureException } from "../../utils/logger";

export const findUserById = async (id: string | number) => {
  try {
    return await userModel.findByPk(id);
  } catch (ex) {
    const msg = `Unable to find user ${id}`;
    captureException(ex, msg);
    throw new Error(msg);
  }
}

export const findUserByQuery = async(query: Partial<IUser>) => {
  try {
    return await userModel.findAll({ where: { ...query }});
  } catch (ex) {
    const msg = `Unable to query users given the params ${JSON.stringify(query)}`;
    captureException(ex, msg);
    throw new Error(msg);
  }
}

export const createUser = async(user: ICreateUser) => {
  try {
    return await userModel.create(user);
  } catch (ex) {
    const msg = `Unable to create user given the data ${JSON.stringify(user)}`;
    captureException(ex, msg);
    throw new Error(msg);
  }
}

export const updateUserById = async (id: string | number, newData: Partial<IUser>) => {
  try {
    const user = await userModel.findByPk(id);
    if (!user) {
      return null;
    }
    return await user.update(newData);
  } catch (ex) {
    const msg = `Unable to find user ${id}`;
    captureException(ex, msg);
    throw new Error(msg);
  }
}


export const cleanseUserData = (user: IUser) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    created: user.created,
    updated: user.updated
  }
}