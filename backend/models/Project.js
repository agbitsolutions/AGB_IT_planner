import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a project name' },
        len: { args: [1, 100], msg: 'Project name cannot exceed 100 characters' }
      }
    },
    description: {
      type: DataTypes.STRING(1000),
      validate: {
        len: { args: [0, 1000], msg: 'Description cannot exceed 1000 characters' }
      }
    },
    team: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tasks: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('tasks');
        return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
      }
    },
    milestones: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('milestones');
        return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
      }
    },
    status: {
      type: DataTypes.ENUM('planning', 'active', 'paused', 'completed', 'archived'),
      defaultValue: 'active',
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#2080c0',
    },
  },
  {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
  }
);

export default Project;
