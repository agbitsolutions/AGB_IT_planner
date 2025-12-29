import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Task extends Model {}

Task.init(
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
        notEmpty: { msg: 'Please provide a task title' },
        len: { args: [1, 200], msg: 'Title cannot exceed 200 characters' }
      }
    },
    description: {
      type: DataTypes.STRING(2000),
      validate: {
        len: { args: [0, 2000], msg: 'Description cannot exceed 2000 characters' }
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
    assignee: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'in_review', 'done'),
      defaultValue: 'todo',
    },
    dueDate: {
      type: DataTypes.DATE,
    },
    estimatedHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    actualHours: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    milestone: {
      type: DataTypes.INTEGER,
      references: {
        model: 'milestones',
        key: 'id'
      }
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('attachments');
        return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
      }
    },
    comments: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('comments');
        return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
      }
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('tags');
        return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
      }
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
    indexes: [
      { fields: ['project', 'status'] },
      { fields: ['assignee'] },
      { fields: ['dueDate'] }
    ]
  }
);

export default Task;
