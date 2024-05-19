import { sendEmail } from '../helpers/email-manager.js';
import { encryptPassword, generateToken } from '../helpers/encryption.js';
import { Client, Movement, User }  from '../model/models.js';
import { getAdminById } from './admin-controller.js';
import { assignWalletToClient } from './wallet-controller.js';
import { config } from 'dotenv'
config()

// Insert a new client (inherits from User)
const insertClient = async (req, suspended=false) => {
    const { username, password, email, profile_picture = undefined, fullname, country, phone } = req.body
    const { usd_name, usd_password, i_name, i_password } = req.body
    let newClient = {
        username,
        password: await encryptPassword(password),
        email,
        profile_picture,
        fullname,
        country,
        phone,
        suspended
    }
    const admin_id = req.body.admin_id
    const admin = await getAdminById(admin_id)
    newClient.admin = admin
    const usd_wallet = {
        type: "USD",
        name: usd_name || "USD Wallet",
        password: await encryptPassword(usd_password)            
    } 
    const i_wallet = {
        type: "INV",
        name: i_name || "Investment Wallet",
        password: await encryptPassword(i_password)
    }
    if(suspended) {
        const token = generateToken()
        newClient.recovery_token = token
        const recovery_link = `${process.env.CORS_ORIGIN || "http://localhost:3000" }/auth/activate-account/${token}`
        const email_sent = sendEmail(
            newClient.email,
            "Activación de Cuenta",
            `Para activar tu cuenta ingresa al siguiente enlace:\n${recovery_link}`
        )
        if(!email_sent) {
            throw error("La dirección de correo electrónico no es válida")
        }
    }
    const client = new Client(newClient);
    client.save();
    await assignWalletToClient(client, admin, usd_wallet, i_wallet)
    return client
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
