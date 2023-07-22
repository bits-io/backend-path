const employeeModel = require('../models/employee');

const createEmployee = async (req, res)=>{

    const { 
        name,
        designation,
        email,
        phone,
        age
     } = req.body;

    const newEmployee = new employeeModel({
        name: name,
        designation: designation,
        email: email,
        phone: phone,
        age: age
    });
    if (req.file) {
        newEmployee.avatar = 'employee/avatar' + req.file.path
    }

    try {
        
        await newEmployee.save();
        res.status(201).json(newEmployee);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error
        });
    }

};

const updateEmployee = async (req, res)=>{
    
    const id = req.params.id;
    const { title, description } = req.body;

    const newEmployee = {
        title : title,
        description : description,
        userId : req.userId
    }

    try {
        
        await employeeModel.findByIdAndUpdate(id, newEmployee, {new : true});
        res.status(200).json(newEmployee);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }


};

const deleteEmployee = async (req, res)=>{
    
    const id = req.params.id;
    try {
        
        const employee = await employeeModel.findByIdAndRemove(id);
        res.status(202).json(employee);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }

};

const getEmployee = async (req, res)=>{
    try {
        
        const employees = await employeeModel.find({userId: req.userId});
        res.status(200).json(employees);    

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}