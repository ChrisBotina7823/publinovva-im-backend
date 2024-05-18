import { sendEmail } from "../helpers/email-manager.js";
import { SupportTicket } from "../model/models.js";
import { getUserById } from "./user-controller.js";

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

const makeSupportTicket = async (id, description, category) => {
    let ticketInfo = {}
    // get client and admin information
    const client = await getUserById(id)
    if(!client) throw new Error(`Client ${id} not found`)
    const admin = await getUserById(client.admin)
    ticketInfo.client = client
    ticketInfo.admin = admin

    ticketInfo.description = description
    ticketInfo.category = category
    
    
    const ticket = await insertSupportTicket(ticketInfo)
    sendEmail(client.email, `Ticket de soporte. Solicitud ${ticket._id}`, `¡Hola! Con este ticket podrás seguir tu solicitud de servicio al cliente. Se te enviará un correo en cuanto tu administrador responda a la solicitud`)
    sendEmail(admin.email, `Servicio al cliente ${ticket.category}.`, `El cliente identificado con usuario ${client.id} ha realizado una solicitud de servicio al cliente a la categoría ${ticket.category}. A continuación el mensaje:\n${ticket.description}`)

    return ticket
}

const getUserTickets = async (user) => {
    const condition = user.__t == "Admin" ? {"admin":user._id} : user.__t == "Client"  ? {"client":user._id} : {}
    return await SupportTicket.find(condition).populate([{path:"client", select:"fullname shortId"}, {path:"admin", select:"entity_name shortId"}]).exec()
}

export {
    insertSupportTicket,
    updateSupportTicket,    
    deleteSupportTicket,
    getSupportTicketById,
    makeSupportTicket,
    getUserTickets
}
