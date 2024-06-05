import { deleteFile } from '../helpers/drive-upload.js';
import { sendEmail } from '../helpers/email-manager.js';
import { encryptPassword, generateToken } from '../helpers/encryption.js';
import { boldStyle, welcomeMessage } from '../helpers/messages.js';
import { getIdFromUrl } from '../helpers/object-depuration.js';
import { Client, Investment, Movement, User, Wallet }  from '../model/models.js';
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
    console.log(username, req.body.admin_id)
    let clientFound = await Client.findOne({username, admin})
    console.log(clientFound)
    if(clientFound) throw new Error(`El nombre de usuario ${username} ya está en uso. Por favor, elige otro nombre de usuario`)
    clientFound = await Client.findOne({email, admin})
    console.log(clientFound)
    if(clientFound) throw new Error(`El correo ${email} ya está en uso. Por favor, elige otro correo electrónico`)
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
        sendEmail(admin.email, "Nuevo Cliente Registrado", `El cliente ${boldStyle(`${newClient.fullname} (${newClient.username})`)} ha llenado el formulario de registro en el sistema`)
        if(!email_sent) {
            throw error("La dirección de correo electrónico no es válida")
        }
    }
    const client = new Client(newClient);
    client.save();
    if(!suspended) {
        sendEmail(client.email, welcomeMessage(client).subject, welcomeMessage(client).description)
    }
    await assignWalletToClient(client, admin, usd_wallet, i_wallet)
    return client
}

// Update client by username
const updateClient = async (id, updatedData) => {
    return await Client.findByIdAndUpdate( id, updatedData, { new: true });
}

// Delete client by username
const deleteClient = async (id) => {
    const client = await Client.findById(id)
    try {
        if(client.profile_picture) await deleteFile(getIdFromUrl(client.profile_picture))
    } catch(err) {
        console.log(err);
    }
    await Investment.deleteMany({client: id})
    await Movement.deleteMany({client: id})
    await Wallet.deleteMany({client: id})
    return await Client.findByIdAndDelete(id);
}

// Get client by username
const getClientByUsername = async (username) => {
    const user = await Client.findOne({ username })
        .populate([
            { path: "admin" },
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
          { path: "admin" },
          { path: "usd_wallet", select: "shortId available_amount" },
          { path: "i_wallet", select: "shortId investment_amount available_amount" }
      ])
      .exec();

    return clients;
}

const getClientByKey = async (username, admin_id) => {
    const user = await Client.findOne({ $or: [{username}, {email:username}], admin: admin_id })
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
