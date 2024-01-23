import { Sequelize } from 'sequelize';
import { config } from './config';

const sequelize = new Sequelize(config[process.env.NODE_ENV!]);
  
export default sequelize