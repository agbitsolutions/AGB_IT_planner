import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a team name'],
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
      unique: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['lead', 'member', 'viewer'],
          default: 'member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    projects: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
      description: 'If true, all new members can access by default',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Team', teamSchema);
