import express from "express"
import bcrypt from 'bcrypt'
import { getAllMovements, insertMovement, updateMovement } from "../controller/movement-controller.js"
import { errorHandler } from '../middlewares/login-md.js'
import { getWalletById, updateWallet } from "../controller/wallet-controller.js"
import { getClientByUsername } from "../controller/client-controller.js"
import { sendEmail } from "../helpers/email-manager.js"
import { getAdminByUsername } from "../controller/admin-controller.js"
import { insertWalletTransaction, performTransaction } from "../controller/wallet-transaction-controller.js"
import { Admin } from "../model/models.js"
import { admin } from "googleapis/build/src/apis/admin/index.js"
import { resourcesettings } from "googleapis/build/src/apis/resourcesettings/index.js"
import { makeSupportTicket } from "../controller/support-ticket-controller.js"

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const movements = await getAllMovements()
        return res.status(200).json(movements)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/wallet-transactions/:username/:dest', async (req, res) => {
    try {
        const { username, dest } = req.params
        const { transaction_amount, wallet_password } = req.body
        const type = dest == 'usd' ? 'usd-transfer' : 'inv-transfer'
        const movement = await performTransaction( username, type, transaction_amount, wallet_password, origin )
        res.status(200).json(movement)
    } catch(err) {
        errorHandler(res, err)
    }
});

router.post('/make-deposit/:username', async (req, res) => {
    try {
        const { username } = req.params
        const { transaction_amount } = req.body
        const movement = await performTransaction(username, 'deposit', transaction_amount);
        res.status(200).json(movement)
    }    catch(err) {
        errorHandler(res, err)
    } 
}); 

router.post('/make-withdrawal/:username', async (req, res) => {
    try {
        const { username } = req.params
        const { transaction_amount, wallet_password } = req.body
        const movement = await performTransaction(username, 'withdrawal', transaction_amount, wallet_password);
        res.status(200).json(movement)
    } catch(err) {
        errorHandler(res, err)
    }
});

router.post('/make-support-ticket/:username', async (req, res) => {
    try {
        const { username } = req.params
        const { description, category } = req.body
        const movement = await makeSupportTicket(username, description, category)
        res.status(200).json(movement)        
    } catch(err) {
        errorHandler(res, err)
    }
})

export default router