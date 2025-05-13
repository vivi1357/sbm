import { Request, Response } from 'express';
import Employee, { IEmployee } from '../models/Employee';

export const employeeController = {
  // Get all employees
  getAllEmployees: async (req: Request, res: Response) => {
    try {
      const employees = await Employee.find();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching employees' });
    }
  },

  // Get employees on bench
  getBenchEmployees: async (req: Request, res: Response) => {
    try {
      const benchEmployees = await Employee.find({
        currentStatus: 'bench',
        availability: true
      }).sort({ benchStartDate: 1 });
      res.json(benchEmployees);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching bench employees' });
    }
  },

  // Create new employee
  createEmployee: async (req: Request, res: Response) => {
    try {
      const employee = new Employee(req.body);
      if (req.body.currentStatus === 'bench') {
        employee.benchStartDate = new Date();
      }
      await employee.save();
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: 'Error creating employee' });
    }
  },

  // Update employee
  updateEmployee: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentEmployee = await Employee.findById(id);
      
      if (!currentEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Update bench start date if status changes to bench
      if (req.body.currentStatus === 'bench' && currentEmployee.currentStatus !== 'bench') {
        req.body.benchStartDate = new Date();
      }

      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      res.json(updatedEmployee);
    } catch (error) {
      res.status(400).json({ error: 'Error updating employee' });
    }
  },

  // Get employee by ID
  getEmployeeById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const employee = await Employee.findById(id);
      
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching employee' });
    }
  },

  // Get employees by skill
  getEmployeesBySkill: async (req: Request, res: Response) => {
    try {
      const { skill } = req.params;
      const employees = await Employee.find({
        skills: { $in: [skill] },
        currentStatus: 'bench',
        availability: true
      });
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching employees by skill' });
    }
  },

  // Get bench statistics
  getBenchStatistics: async (req: Request, res: Response) => {
    try {
      const totalOnBench = await Employee.countDocuments({
        currentStatus: 'bench'
      });

      const benchByDepartment = await Employee.aggregate([
        { $match: { currentStatus: 'bench' } },
        { $group: { _id: '$department', count: { $sum: 1 } } }
      ]);

      const benchBySkill = await Employee.aggregate([
        { $match: { currentStatus: 'bench' } },
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } }
      ]);

      res.json({
        totalOnBench,
        benchByDepartment,
        benchBySkill
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching bench statistics' });
    }
  }
};

export default employeeController; 