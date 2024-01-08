import express from 'express'
import { encryptPassword } from '../helpers/encryption.js'
import { deleteClient, insertClient, updateClient, getAllClients, getClientByUsername } from '../controller/client-controller.js'
import { errorHandler, isAdminLogged, isUserLogged } from '../middlewares/login-md.js'
import { assignWalletToClient, updateWallet, updateWalletById } from '../controller/wallet-controller.js'
import { getAdminByUsername } from '../controller/admin-controller.js'
import { getUserByUsername } from '../controller/user-controller.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try { 
        const clients = await getAllClients()
        res.status(200).json(clients) 
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/', isAdminLogged, async (req, res) => {
    try {
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
        }
        const admin = await getAdminByUsername(req.user.username)
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
        
        const client = await insertClient(newClient)
        await assignWalletToClient(client, admin, usd_wallet, i_wallet)
        req.io.emit("clientsUpdate")
        res.status(200).json(client) 
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params
        const customer = await getClientByUsername  (username)
        res.status(200).json(customer)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.put('/:username', async (req, res) => {
    try {
        const { username } = req.params
        const clientInfo = req.body
        const prevUser = await getUserByUsername(username)
        if(clientInfo.password) {
            clientInfo.password = await encryptPassword(clientInfo.password) 
            clientInfo.passwordVersion = prevUser.passwordVersion+1;
        }
        const updatedClient = await updateClient(username, clientInfo)

        // Wallet Information
        const { usd_balance = undefined, usd_address = undefined } = req.body
        const { i_password = undefined, usd_password = undefined } = req.body 
        if(usd_balance) await updateWalletById(updatedClient.usd_wallet.toString(), {available_amount: usd_balance})
        if(i_password) await updateWalletById(updatedClient.i_wallet.toString(), {password: await encryptPassword(i_password)})
        if(usd_password) await updateWalletById(updatedClient.usd_wallet.toString(), {password: await encryptPassword(usd_password)})
        if(usd_address) await updateWalletById(updatedClient.usd_wallet.toString(), {address: usd_address})

        req.io.emit("clientsUpdate")
        req.io.emit("usersUpdate")
        res.status(200).json(updatedClient)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.delete('/:username', isAdminLogged, async (req, res) => {
    try {
        const { username } = req.params
        await deleteClient(username)
        req.io.emit("clientsUpdate")
        res.status(200).json(`Deleted user ${username}`)
    } catch(err) {
        errorHandler(res, err)
    }
})

export default router