import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a milestone title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: true,
    },
    team: {
      type: mongoose.Schema.ObjectId,
      ref: 'Team',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide a due date'],
    },
    tasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Task',
      },
    ],
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'at_risk', 'completed'],
      default: 'not_started',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Index for timeline queries
milestoneSchema.index({ team: 1, dueDate: 1 });
milestoneSchema.index({ project: 1, status: 1 });

export default mongoose.model('Milestone', milestoneSchema);
