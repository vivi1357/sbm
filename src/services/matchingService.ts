import { IEmployee } from '../models/Employee';
import { IProject } from '../models/Project';
import { Types } from 'mongoose';

export interface MatchScore {
  employeeId: string;
  projectId: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export const matchingService = {
  // Calculate match score between an employee and a project
  calculateMatchScore(employee: IEmployee, project: IProject): MatchScore {
    const employeeSkills = new Set(employee.skills);
    const requiredSkills = new Set(project.requiredSkills);
    
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    
    // Find matching and missing skills
    project.requiredSkills.forEach(skill => {
      if (employeeSkills.has(skill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });
    
    // Calculate score based on matched skills percentage
    const score = (matchedSkills.length / project.requiredSkills.length) * 100;
    
    return {
      employeeId: (employee._id as Types.ObjectId).toString(),
      projectId: (project._id as Types.ObjectId).toString(),
      score,
      matchedSkills,
      missingSkills
    };
  },

  // Find best matching projects for an employee
  findMatchingProjects(employee: IEmployee, projects: IProject[]): MatchScore[] {
    const matches = projects.map(project => 
      this.calculateMatchScore(employee, project)
    );
    
    // Sort by score in descending order
    return matches.sort((a, b) => b.score - a.score);
  },

  // Find best matching employees for a project
  findMatchingEmployees(project: IProject, employees: IEmployee[]): MatchScore[] {
    const matches = employees.map(employee => 
      this.calculateMatchScore(employee, project)
    );
    
    // Sort by score in descending order
    return matches.sort((a, b) => b.score - a.score);
  },

  // Get recommended training based on skill gaps
  getRecommendedTraining(employee: IEmployee, projects: IProject[]): string[] {
    const allRequiredSkills = new Set<string>();
    const employeeSkills = new Set(employee.skills);
    const missingSkills = new Set<string>();

    // Collect all unique required skills from projects
    projects.forEach(project => {
      project.requiredSkills.forEach(skill => {
        allRequiredSkills.add(skill);
      });
    });

    // Identify missing skills
    allRequiredSkills.forEach(skill => {
      if (!employeeSkills.has(skill)) {
        missingSkills.add(skill);
      }
    });

    return Array.from(missingSkills);
  }
};

export default matchingService; 