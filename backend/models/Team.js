import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Team extends Model {}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Please provide a team name' },
        len: { args: [1, 100], msg: 'Team name cannot exceed 100 characters' }
      }
    },
    description: {
      type: DataTypes.STRING(500),
      validate: {
        len: { args: [0, 500], msg: 'Description cannot exceed 500 characters' }
      }
    },
    members: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('members');
        return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
      },
      comment: 'Array of {userId, name, whatsappNumber, role, joinedAt}'
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projects: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('projects');
        return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
      }
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Team',
    tableName: 'teams',
    timestamps: true,
  }
);

export default Team;
