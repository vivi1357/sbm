import mongoose, { Schema, Document } from 'mongoose';

export interface ITraining extends Document {
  name: string;
  description: string;
  skillsProvided: string[];
  duration: number; // in weeks
  type: 'technical' | 'soft-skills' | 'domain' | 'certification';
  level: 'beginner' | 'intermediate' | 'advanced';
  provider: string;
  maxParticipants: number;
  currentParticipants: mongoose.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'ongoing' | 'completed';
  prerequisites: string[];
  certificationOffered: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const TrainingSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  skillsProvided: [{ type: String, required: true }],
  duration: { type: Number, required: true },
  type: {
    type: String,
    enum: ['technical', 'soft-skills', 'domain', 'certification'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  provider: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  currentParticipants: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  prerequisites: [{ type: String }],
  certificationOffered: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<ITraining>('Training', TrainingSchema); 