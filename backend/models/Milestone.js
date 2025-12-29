import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Milestone extends Model {}

Milestone.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a milestone title' },
        len: { args: [1, 200], msg: 'Title cannot exceed 200 characters' }
      }
    },
    description: {
      type: DataTypes.STRING(1000),
      validate: {
        len: { args: [0, 1000], msg: 'Description cannot exceed 1000 characters' }
      }
    },
    project: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id'
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide a start date' }
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide a due date' }
      }
    },
    tasks: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('tasks');
        return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
      }
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'at_risk', 'completed'),
      defaultValue: 'not_started',
    },
    progress: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    owner: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Milestone',
    tableName: 'milestones',
    timestamps: true,
    indexes: [
      { fields: ['team', 'dueDate'] },
      { fields: ['project', 'status'] }
    ]
  }
);

export default Milestone;
