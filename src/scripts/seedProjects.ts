import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project, { IProject } from '../models/Project';

dotenv.config();

// Project templates to generate variations from
const projectTemplates = [
  {
    namePrefix: 'E-commerce Platform',
    description: 'Development of a modern e-commerce platform with advanced features',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'REST API'],
    department: 'Engineering',
    teamSizeRange: [5, 12]
  },
  {
    namePrefix: 'Data Analytics Dashboard',
    description: 'Building a real-time analytics dashboard for business intelligence',
    skills: ['Python', 'Machine Learning', 'Data Science', 'SQL', 'React'],
    department: 'Data Science',
    teamSizeRange: [3, 8]
  },
  {
    namePrefix: 'Cloud Migration',
    description: 'Migrating legacy systems to cloud infrastructure',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps', 'CI/CD'],
    department: 'Cloud Infrastructure',
    teamSizeRange: [4, 10]
  },
  {
    namePrefix: 'Mobile App',
    description: 'Developing a cross-platform mobile application',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    department: 'Mobile Development',
    teamSizeRange: [3, 7]
  },
  {
    namePrefix: 'Healthcare System',
    description: 'Building a healthcare management system',
    skills: ['Java', 'Spring Boot', 'SQL', 'Healthcare', 'REST API'],
    department: 'Backend Development',
    teamSizeRange: [6, 15]
  }
];

const locations = [
  'New York', 'San Francisco', 'London', 'Singapore', 'Sydney',
  'Berlin', 'Toronto', 'Tokyo', 'Bangalore', 'Amsterdam'
];

// Helper function to get random date within range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate mock projects
const generateMockProjects = (): Partial<IProject>[] => {
  const projects: Partial<IProject>[] = [];
  const now = new Date();
  const sixMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
  const statuses: ('planning' | 'active' | 'completed' | 'on-hold')[] = ['planning', 'active', 'completed', 'on-hold'];
  const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

  // Generate multiple variations of each project template
  projectTemplates.forEach((template, index) => {
    // Create 4 variations of each template
    for (let i = 1; i <= 4; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const [minTeamSize, maxTeamSize] = template.teamSizeRange;
      const teamSize = Math.floor(Math.random() * (maxTeamSize - minTeamSize + 1)) + minTeamSize;

      const project: Partial<IProject> = {
        name: `${template.namePrefix} ${index * 4 + i}`,
        description: `${template.description} - Version ${i}`,
        startDate: getRandomDate(now, new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())),
        endDate: status === 'completed' ? getRandomDate(now, sixMonthsFromNow) : undefined,
        status,
        requiredSkills: template.skills,
        teamSize,
        currentTeamMembers: [], // Will be populated when assigning employees
        department: template.department,
        priority,
        location,
        remote: Math.random() > 0.5
      };

      projects.push(project);
    }
  });

  return projects;
};

// Connect to MongoDB and seed data
const seedProjects = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-bench';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Insert mock projects
    const mockProjects = generateMockProjects();
    await Project.insertMany(mockProjects);
    console.log(`Successfully seeded ${mockProjects.length} mock projects`);

    // Print some statistics
    const planningCount = mockProjects.filter(p => p.status === 'planning').length;
    const activeCount = mockProjects.filter(p => p.status === 'active').length;
    const completedCount = mockProjects.filter(p => p.status === 'completed').length;
    const onHoldCount = mockProjects.filter(p => p.status === 'on-hold').length;

    console.log('\nProject Statistics:');
    console.log(`- Planning: ${planningCount}`);
    console.log(`- Active: ${activeCount}`);
    console.log(`- Completed: ${completedCount}`);
    console.log(`- On Hold: ${onHoldCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedProjects(); 