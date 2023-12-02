import { Client, Movement, User }  from '../model/models.js';

// Insert a new client (inherits from User)
const insertClient = async (clientJson) => {
    const client = new Client(clientJson);
    return await client.save();
}

// Update client by username
const updateClient = async (username, updatedData) => {
    return await Client.findOneAndUpdate({ username }, updatedData, { new: true });
}

// Delete client by username
const deleteClient = async (username) => {
    return await Client.findOneAndDelete({ username });
}

// Get client by username
const getClientByUsername = async (username) => {
    return await Client.findOne({ username });
}

const getClientMovements = async (username) => {
    return await Movement.find({client: await getClientByUsername(username)})
}

const getAllClients = async () => {
    return await Client.find({})
}

export {
    insertClient,
    updateClient,
    deleteClient,
    getClientByUsername,
    getClientMovements,
    getAllClients
}
