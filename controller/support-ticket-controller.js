import { sendEmail } from "../helpers/email-manager.js";
import { SupportTicket } from "../model/models.js";
import { getClientByUsername } from "./client-controller.js";
import { getUserById, getUserByUsername } from "./user-controller.js";

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

const makeSupportTicket = async (username, description, category) => {
    let ticketInfo = {}
    // get client and admin information
    const client = await getClientByUsername(username)
    if(!client) throw new Error(`Client ${username} not found`)
    const admin = await getUserById(client.admin)
    ticketInfo.client = client
    ticketInfo.admin = admin

    ticketInfo.description = description
    ticketInfo.category = category
    
    
    const ticket = await insertSupportTicket(ticketInfo)
    sendEmail(client.email, `Ticket de soporte. Solicitud ${ticket._id}`, `¡Hola! Con este ticket podrás seguir tu solicitud de servicio al cliente. Se te enviará un correo en cuanto tu administrador responda a la solicitud`)
    sendEmail(admin.email, `Servicio al cliente ${ticket.category}.`, `El cliente identificado con usuario ${client.username} ha realizado una solicitud de servicio al cliente a la categoría ${ticket.category}. A continuación el mensaje:\n${ticket.description}`)

    return ticket
}

const getUserTickets = async (user) => {
    return (
        user?.__t == "Admin" ?
        await SupportTicket.find({admin:user._id})
        : user?.__t == "Client" ?
        await SupportTicket.find({client:user._id})
        : await SupportTicket.find({}) 
    )
}

export {
    insertSupportTicket,
    updateSupportTicket,    
    deleteSupportTicket,
    getSupportTicketById,
    makeSupportTicket,
    getUserTickets
}
