const { getLeaveRecords, getPendingLeaveRecords, updateLeaveStatus } = require('../model/leaveModal.js');

const getEmployeeLeave = async (req, res) => {
    const emp_id = req.query.emp_id || null;

    try {
        const leaveData = await getLeaveRecords(emp_id);
        res.status(200).json({
            message: `Leave data ${emp_id ? 'for Employee ' + emp_id : 'all'} fetched successfully`,
            data: leaveData
        });
    } catch (error) {
        console.error("Error in getEmployeeLeave controller:", error.message);
        res.status(500).json({
            message: "Failed to retrieve leave data.",
            error: error.message
        });
    }
};

const getPendingLeaves = async (req, res) => {
    try {
        const pendingLeaveData = await getPendingLeaveRecords();
        res.status(200).json({
            message: "Pending leave data fetched successfully",
            data: pendingLeaveData
        });
    } catch (error) {
        console.error("Error in getPendingLeaves controller:", error.message);
        res.status(500).json({
            message: "Failed to retrieve pending leave data.",
            error: error.message
        });
    }
};

const updateLeave = async (req, res) => {
    const { leave_id, new_status } = req.body;

    // Basic input validation
    if (!leave_id || !new_status) {
        return res.status(400).json({ message: "Missing leave_id or new_status in request body." });
    }
    if (!['Approved', 'Denied'].includes(new_status)) {
        return res.status(400).json({ message: "Invalid new_status. Must be 'Approved' or 'Denied'." });
    }

    try {
        const result = await updateLeaveStatus(leave_id, new_status);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Leave record not found or no change made." });
        }

        res.status(200).json({
            message: `Leave status for ID ${leave_id} updated to ${new_status}`,
            data: { leave_id, new_status }
        });
    } catch (error) {
        console.error("Error in updateLeave controller:", error.message);
        res.status(500).json({
            message: "Failed to update leave status.",
            error: error.message
        });
    }
};

module.exports = {
    getEmployeeLeave,
    getPendingLeaves, 
    updateLeave       
};