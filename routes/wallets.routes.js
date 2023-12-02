import express from "express"
import { getAllWallets, getWalletById, updateWallet } from "../controller/wallet-controller.js"
import { errorHandler } from "../middlewares/login-md.js"
import { encryptPassword } from '../helpers/encryption.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const wallets = await getAllWallets()
        return res.status(200).json(wallets)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const wallet = await getWalletById(id)
        res.status(200).json(wallet)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/change-password/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { password } = req.body
        const updatedWallet = await updateWallet(id, {password: await encryptPassword(password)})
        res.status(200).json(updatedWallet)
    } catch(err) {
        errorHandler(res, err)
    }
})


router.put('/:username/:type', async (req, res) => {
    try {
        const { username, type } = req.params
        const updatedData = req.body
        const updatedWallet = await updateWallet(username, type, updatedData)
        res.status(200).json(updatedWallet)
    } catch(err) {
        errorHandler(res, err)
    }
})

export default router