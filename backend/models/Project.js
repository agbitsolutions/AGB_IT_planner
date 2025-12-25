import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    team: {
      type: mongoose.Schema.ObjectId,
      ref: 'Team',
      required: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Task',
      },
    ],
    milestones: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Milestone',
      },
    ],
    status: {
      type: String,
      enum: ['planning', 'active', 'paused', 'completed', 'archived'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    color: {
      type: String,
      default: '#2080c0',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
