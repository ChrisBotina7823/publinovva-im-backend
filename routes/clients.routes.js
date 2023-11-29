import express from 'express'
import { encryptPassword } from '../helpers/encryption.js'
import { deleteClient, insertClient, updateClient, getAllClients } from '../controller/client-controller.js'
import { errorHandler, isAdminLogged, isUserLogged } from '../middlewares/login-md.js'

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
        let newClient = {
            username,
            password: await encryptPassword(password),
            email,
            profile_picture,
            fullname,
            country,
            phone
        }
        await insertClient(newClient)
        res.status(200).json(`Customer added: ${username}`)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params
        const customer = await getCustomerById(username)
        res.status(200).json(customer)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.put('/:prevUsername', isAdminLogged, async (req, res) => {
    try {
        const { prevUsername } = req.params
        const { username, password, email, profile_picture = undefined, fullname, country, phone } = req.body
        let updatedClient = {
            username,
            password: await encryptPassword(password),
            email,
            profile_picture,
            fullname,
            country,
            phone
        }
        await updateClient(prevUsername, updatedClient)
        res.status(200).json(`Customer information updated: ${username}`)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.delete('/:username', isAdminLogged, async (req, res) => {
    try {
        const { username } = req.params
        await deleteClient(username)
        res.status(200).json(`Deleted user ${username}`)
    } catch(err) {
        errorHandler(res, err)
    }
})

export default router