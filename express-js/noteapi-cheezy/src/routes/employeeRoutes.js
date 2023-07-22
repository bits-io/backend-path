const express = require('express');
const { getEmployee, createEmployee, deleteEmployee, updateEmployee} = require('../controllers/employeeController');
const auth = require('../middlewares/auth');
const employeeRouter = express.Router();
const upload = require('../middlewares/upload')

employeeRouter.get('/', getEmployee);

employeeRouter.post('/', upload.single('avatar'), createEmployee);

employeeRouter.put('/:id', updateEmployee);

employeeRouter.delete('/:id', deleteEmployee);

module.exports = employeeRouter;