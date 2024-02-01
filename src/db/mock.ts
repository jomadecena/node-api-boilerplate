import sequelize from '.';
import { Sequelize, DataTypes, SyncOptions } from 'sequelize';

const modelFuncs = {
  findByPk: jest.fn(),
  findByOne: jest.fn(),
  create: jest.fn()
}

jest.mock('sequelize', () => {
  const mSequelize = {
    sync: jest.fn(),
  };
  const actualSequelize = jest.requireActual('sequelize');
  return { Sequelize: jest.fn(() => mSequelize), DataTypes: actualSequelize.DataTypes };
});

const mockedSequelizedSync = () => {
  const mockedSequelized = new Sequelize();
  jest.mocked(mockedSequelized.sync)
}

export {
  mockedSequelizedSync
}