import { Client, Movement, User }  from '../model/models.js';

// Insert a new client (inherits from User)
const insertClient = async (clientJson) => {
    const client = new Client(clientJson);
    return await client.save();
}

// Update client by username
const updateClient = async (id, updatedData) => {
    return await Client.findByIdAndUpdate( id, updatedData, { new: true });
}

// Delete client by username
const deleteClient = async (id) => {
    return await Client.findByIdAndDelete(id);
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

const getClientMovements = async (id) => {
    return await Movement.find({client: await getUserById(id)})
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

const getClientByKey = async (username, admin_id) => {
    const user = await Client.findOne({ username, admin: admin_id })
    if(user) {
        const populateFields = [{path:"admin"}, {path:"usd_wallet"}, {path:"i_wallet"}]
        await User.populate(user, populateFields);
    }
    return user
}

export {
    insertClient,
    updateClient,
    deleteClient,
    getClientByUsername,
    getClientMovements,
    getAllClients,
    getClientByKey
}
