import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Training, { ITraining } from '../models/Training';

dotenv.config();

// Training program templates
const trainingTemplates = [
  {
    namePrefix: 'Advanced Web Development',
    description: 'Comprehensive training in modern web development technologies and best practices',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'REST API'],
    type: 'technical',
    level: 'advanced',
    provider: 'Tech Academy',
    durationWeeks: 12,
    prerequisites: ['Basic JavaScript', 'HTML/CSS'],
    maxParticipants: 30
  },
  {
    namePrefix: 'Data Science Fundamentals',
    description: 'Introduction to data science concepts, tools, and methodologies',
    skills: ['Python', 'Machine Learning', 'Data Science', 'SQL'],
    type: 'technical',
    level: 'beginner',
    provider: 'Data Institute',
    durationWeeks: 8,
    prerequisites: ['Basic Programming'],
    maxParticipants: 25
  },
  {
    namePrefix: 'Cloud Architecture',
    description: 'Learn to design and implement cloud-native solutions',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps'],
    type: 'technical',
    level: 'intermediate',
    provider: 'Cloud Experts',
    durationWeeks: 10,
    prerequisites: ['Basic Cloud Knowledge'],
    maxParticipants: 20
  },
  {
    namePrefix: 'Project Management Professional',
    description: 'Comprehensive training for project management certification',
    skills: ['Project Management', 'Agile Methodology', 'Scrum', 'Team Leadership'],
    type: 'certification',
    level: 'intermediate',
    provider: 'PM Institute',
    durationWeeks: 16,
    prerequisites: ['Basic Project Management'],
    maxParticipants: 35
  },
  {
    namePrefix: 'Business Analysis',
    description: 'Learn business analysis techniques and best practices',
    skills: ['Business Analysis', 'Communication', 'Problem Solving'],
    type: 'domain',
    level: 'intermediate',
    provider: 'Business School',
    durationWeeks: 6,
    prerequisites: [],
    maxParticipants: 40
  },
  {
    namePrefix: 'Soft Skills Development',
    description: 'Enhance leadership and communication skills',
    skills: ['Communication', 'Team Leadership', 'Problem Solving'],
    type: 'soft-skills',
    level: 'beginner',
    provider: 'Professional Development Institute',
    durationWeeks: 4,
    prerequisites: [],
    maxParticipants: 50
  }
];

// Helper function to get random date within range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate mock training programs
const generateMockTrainings = (): Partial<ITraining>[] => {
  const trainings: Partial<ITraining>[] = [];
  const now = new Date();
  const sixMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
  const statuses: ('upcoming' | 'ongoing' | 'completed')[] = ['upcoming', 'ongoing', 'completed'];

  // Generate multiple instances of each training template
  trainingTemplates.forEach((template, index) => {
    // Create 3 variations of each template with different start dates and statuses
    for (let i = 1; i <= 3; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const startDate = getRandomDate(now, new Date(now.getFullYear(), now.getMonth() + 2, now.getDate()));
      
      const training: Partial<ITraining> = {
        name: `${template.namePrefix} - Batch ${index * 3 + i}`,
        description: template.description,
        skillsProvided: template.skills,
        duration: template.durationWeeks,
        type: template.type as 'technical' | 'soft-skills' | 'domain' | 'certification',
        level: template.level as 'beginner' | 'intermediate' | 'advanced',
        provider: template.provider,
        maxParticipants: template.maxParticipants,
        currentParticipants: [], // Will be populated when assigning employees
        startDate,
        endDate: new Date(startDate.getTime() + template.durationWeeks * 7 * 24 * 60 * 60 * 1000),
        status,
        prerequisites: template.prerequisites,
        certificationOffered: template.type === 'certification'
      };

      trainings.push(training);
    }
  });

  return trainings;
};

// Connect to MongoDB and seed data
const seedTrainings = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-bench';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing trainings
    await Training.deleteMany({});
    console.log('Cleared existing trainings');

    // Insert mock trainings
    const mockTrainings = generateMockTrainings();
    await Training.insertMany(mockTrainings);
    console.log(`Successfully seeded ${mockTrainings.length} mock training programs`);

    // Print some statistics
    const upcomingCount = mockTrainings.filter(t => t.status === 'upcoming').length;
    const ongoingCount = mockTrainings.filter(t => t.status === 'ongoing').length;
    const completedCount = mockTrainings.filter(t => t.status === 'completed').length;

    console.log('\nTraining Program Statistics:');
    console.log(`- Upcoming: ${upcomingCount}`);
    console.log(`- Ongoing: ${ongoingCount}`);
    console.log(`- Completed: ${completedCount}`);
    console.log(`- Total Available Seats: ${mockTrainings.reduce((acc, curr) => acc + (curr.maxParticipants || 0), 0)}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedTrainings(); 