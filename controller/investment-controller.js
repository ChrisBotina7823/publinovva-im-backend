import { Investment } from "../model/models";

// Insert a new investment
const insertInvestment = async (investmentJson) => {
    const investment = new Investment(investmentJson);
    return await investment.save();
}

// Update investment by ID
const updateInvestment = async (investmentId, updatedData) => {
    return await Investment.findByIdAndUpdate(investmentId, updatedData, { new: true });
}

// Delete investment by ID
const deleteInvestment = async (investmentId) => {
    return await Investment.findByIdAndDelete(investmentId);
}

// Get investment by ID
const getInvestmentById = async (investmentId) => {
    return await Investment.findById(investmentId);
}

export {
    insertInvestment,
    updateInvestment,
    deleteInvestment,
    getInvestmentById
}
