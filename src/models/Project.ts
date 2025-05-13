import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  requiredSkills: string[];
  teamSize: number;
  currentTeamMembers: mongoose.Types.ObjectId[];
  department: string;
  priority: 'low' | 'medium' | 'high';
  location: string;
  remote: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'on-hold'],
    default: 'planning'
  },
  requiredSkills: [{ type: String }],
  teamSize: { type: Number, required: true },
  currentTeamMembers: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  department: { type: String, required: true },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  location: { type: String, required: true },
  remote: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IProject>('Project', ProjectSchema); 