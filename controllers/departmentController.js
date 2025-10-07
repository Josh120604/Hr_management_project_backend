const Department = require('../model/departmentModel');

exports.getTDepartmentById = async (req, res) => {
    try {
        const {department_id} = req.params;
        const department = await Department.getDepartmentById(department_id);

        if(!department){
            return res.status(404).json({message: 'Department not found'});
        }
        res.status(200).json({department});
    } catch (e) {
        console.error('Error in getDepartmentById: ', e);
        res.status(500).json({error: 'Failed to retrieve department details'});
    }
}