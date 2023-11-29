import { SupportTicket } from "../model/models.js";

// Insert a new support ticket (inherits from Movement)
const insertSupportTicket = async (supportTicketJson) => {
    const supportTicket = new SupportTicket(supportTicketJson);
    return await supportTicket.save();
}

// Update support ticket by ID
const updateSupportTicket = async (supportTicketId, updatedData) => {
    return await SupportTicket.findByIdAndUpdate(supportTicketId, updatedData, { new: true });
}

// Delete support ticket by ID
const deleteSupportTicket = async (supportTicketId) => {
    return await SupportTicket.findByIdAndDelete(supportTicketId);
}

// Get support ticket by ID
const getSupportTicketById = async (supportTicketId) => {
    return await SupportTicket.findById(supportTicketId);
}

export {
    insertSupportTicket,
    updateSupportTicket,
    deleteSupportTicket,
    getSupportTicketById
}
