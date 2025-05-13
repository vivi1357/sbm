import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  email: string;
  skills: string[];
  currentStatus: 'bench' | 'assigned' | 'training';
  benchStartDate?: Date;
  lastProject?: string;
  preferredRoles: string[];
  experience: number;
  completedTrainings: string[];
  ongoingTraining?: string;
  availability: boolean;
  location: string;
  department: string;
  updatedAt: Date;
  createdAt: Date;
}

const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: [{ type: String }],
  currentStatus: {
    type: String,
    enum: ['bench', 'assigned', 'training'],
    default: 'bench'
  },
  benchStartDate: { type: Date },
  lastProject: { type: String },
  preferredRoles: [{ type: String }],
  experience: { type: Number, required: true },
  completedTrainings: [{ type: String }],
  ongoingTraining: { type: String },
  availability: { type: Boolean, default: true },
  location: { type: String, required: true },
  department: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema); 