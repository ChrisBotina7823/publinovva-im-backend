import express from 'express'
import { encryptPassword } from '../helpers/encryption.js'
import { deleteClient, insertClient, updateClient, getAllClients } from '../controller/client-controller.js'
import { errorHandler, isAdminLogged, isUserLogged } from '../middlewares/login-md.js'
import { assignWalletToClient, updateWallet, updateWalletById } from '../controller/wallet-controller.js'
import { getAdminById } from '../controller/admin-controller.js'
import { getUserById } from '../controller/user-controller.js'

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
        req.body.admin_id = req.user._id
        const client = await insertClient(req)
        req.io.emit("clientsUpdate")
        res.status(200).json(client) 
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const customer = await getUserById(id)
        res.status(200).json(customer)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const clientInfo = req.body
        const prevUser = await getUserById(id)
        if(clientInfo.password) {
            clientInfo.password = await encryptPassword(clientInfo.password) 
            clientInfo.passwordVersion = (prevUser.passwordVersion || 0) + 1;
        }
        const updatedClient = await updateClient(id, clientInfo)
        console.log(updatedClient)

        // Wallet Information
        const { usd_balance = undefined, usd_address = undefined } = req.body
        const { i_password = undefined, usd_password = undefined } = req.body 
        console.log(updateClient)
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

router.delete('/:id', isAdminLogged, async (req, res) => {
    try {
        const { id } = req.params
        await deleteClient(id)
        req.io.emit("clientsUpdate")
        res.status(200).json(`Deleted user ${id}`)
    } catch(err) {
        errorHandler(res, err)
    }
})

export default router