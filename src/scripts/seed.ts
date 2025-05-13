import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee, { IEmployee } from '../models/Employee';

dotenv.config();

// Define common data pools
const skills = [
  // Technical Skills
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'React', 'Angular', 'Vue.js',
  'Node.js', 'Express.js', 'MongoDB', 'SQL', 'AWS', 'Azure', 'Docker', 'Kubernetes',
  'Machine Learning', 'Data Science', 'DevOps', 'CI/CD', 'Git', 'REST API',
  // Domain Skills
  'Healthcare', 'Finance', 'E-commerce', 'Education', 'Manufacturing',
  // Soft Skills
  'Project Management', 'Team Leadership', 'Communication', 'Problem Solving',
  'Agile Methodology', 'Scrum', 'Business Analysis'
];

const departments = [
  'Engineering',
  'Data Science',
  'Product Management',
  'DevOps',
  'Quality Assurance',
  'Business Analysis',
  'Cloud Infrastructure',
  'Mobile Development',
  'Frontend Development',
  'Backend Development'
];

const locations = [
  'New York', 'San Francisco', 'London', 'Singapore', 'Sydney',
  'Berlin', 'Toronto', 'Tokyo', 'Bangalore', 'Amsterdam'
];

const roles = [
  'Software Engineer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
  'QA Engineer',
  'Business Analyst',
  'Cloud Architect',
  'Mobile Developer',
  'Frontend Developer',
  'Backend Developer'
];

// Helper function to get random items from array
const getRandomItems = (arr: string[], min: number, max: number): string[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get random date within range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate 100 mock employees
const generateMockEmployees = (): Partial<IEmployee>[] => {
  const employees: Partial<IEmployee>[] = [];
  const statuses: ('bench' | 'assigned' | 'training')[] = ['bench', 'assigned', 'training'];
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

  for (let i = 1; i <= 100; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Generate skills based on department
    const departmentSkills = skills.filter(skill => {
      if (department.includes('Development')) return skill.includes('JavaScript') || skill.includes('Python') || skill.includes('Java');
      if (department === 'Data Science') return skill.includes('Python') || skill.includes('Machine Learning') || skill.includes('Data');
      if (department === 'DevOps') return skill.includes('Docker') || skill.includes('Kubernetes') || skill.includes('CI/CD');
      return true;
    });

    const employee: Partial<IEmployee> = {
      name: `Employee ${i}`,
      email: `employee${i}@company.com`,
      skills: getRandomItems(departmentSkills, 3, 8),
      currentStatus: status,
      benchStartDate: status === 'bench' ? getRandomDate(sixMonthsAgo, now) : undefined,
      lastProject: status === 'bench' ? `Previous Project ${Math.floor(Math.random() * 20) + 1}` : undefined,
      preferredRoles: getRandomItems(roles, 1, 3),
      experience: Math.floor(Math.random() * 15) + 1, // 1-15 years
      completedTrainings: getRandomItems(skills, 0, 5),
      ongoingTraining: status === 'training' ? skills[Math.floor(Math.random() * skills.length)] : undefined,
      availability: status === 'bench',
      location,
      department
    };

    employees.push(employee);
  }

  return employees;
};

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-bench';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing employees
    await Employee.deleteMany({});
    console.log('Cleared existing employees');

    // Insert mock employees
    const mockEmployees = generateMockEmployees();
    await Employee.insertMany(mockEmployees);
    console.log('Successfully seeded 100 mock employees');

    // Print some statistics
    const benchCount = mockEmployees.filter(e => e.currentStatus === 'bench').length;
    const assignedCount = mockEmployees.filter(e => e.currentStatus === 'assigned').length;
    const trainingCount = mockEmployees.filter(e => e.currentStatus === 'training').length;

    console.log('\nEmployee Statistics:');
    console.log(`- On Bench: ${benchCount}`);
    console.log(`- Assigned: ${assignedCount}`);
    console.log(`- In Training: ${trainingCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 