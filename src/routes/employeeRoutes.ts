import { Router } from 'express';
import employeeController from '../controllers/employeeController';

const router = Router();

// Get all employees
router.get('/', employeeController.getAllEmployees);

// Get employees on bench
router.get('/bench', employeeController.getBenchEmployees);

// Get bench statistics
router.get('/bench/statistics', employeeController.getBenchStatistics);

// Get employees by skill
router.get('/skill/:skill', employeeController.getEmployeesBySkill);

// Get employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Create new employee
router.post('/', employeeController.createEmployee);

// Update employee
router.put('/:id', employeeController.updateEmployee);

export default router; 