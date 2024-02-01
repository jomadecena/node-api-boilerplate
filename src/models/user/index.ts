import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import sequelize from '../../db';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare created: string;
  declare updated: CreationOptional<string>;
  declare otp: CreationOptional<string>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.DATE,
    },
    updated: {
      type: DataTypes.DATE,
    }
  },
  {
    sequelize,
    modelName: 'user'
  }
)

export type IUser = InferAttributes<User>;
export type ICreateUser = InferAttributes<User, {omit: 'id' | 'updated' | 'otp'}>;

export default User;