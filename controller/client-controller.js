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
    const user = await Client.findOne({ username })
        .populate([
            { path: "admin", select: "shortId username deposit_address deposit_qr" },
            { path: "usd_wallet", select: "shortId available_amount address" },
            { path: "i_wallet", select: "shortId investment_amount available_amount" }
        ])
        .exec();
    return user
}

const getClientMovements = async (username) => {
    return await Movement.find({client: await getClientByUsername(username)})
}

const getAllClients = async () => {
    const clients = await Client.find({})
      .populate([
          { path: "admin", select: "shortId username deposit_address deposit_qr" },
          { path: "usd_wallet", select: "shortId available_amount" },
          { path: "i_wallet", select: "shortId investment_amount available_amount" }
      ])
      .exec();

    return clients;
}

export {
    insertClient,
    updateClient,
    deleteClient,
    getClientByUsername,
    getClientMovements,
    getAllClients
}
