import express from "express"
import bcrypt from 'bcrypt'
import { getAllMovements, insertMovement, updateMovement } from "../controller/movement-controller.js"
import { errorHandler, isAdminLogged } from '../middlewares/login-md.js'
import { getWalletById, updateWallet } from "../controller/wallet-controller.js"
import { updateClient } from "../controller/client-controller.js"
import { sendEmail } from "../helpers/email-manager.js"
import { getAdminByUsername } from "../controller/admin-controller.js"
import { approveTransaction, getUserTransactions, getWalletTransactionById, insertWalletTransaction, performTransaction, updateWalletTransaction } from "../controller/wallet-transaction-controller.js"
import { Admin } from "../model/models.js"
import { admin } from "googleapis/build/src/apis/admin/index.js"
import { resourcesettings } from "googleapis/build/src/apis/resourcesettings/index.js"
import { getUserTickets, makeSupportTicket } from "../controller/support-ticket-controller.js"
import { getUserById } from "../controller/user-controller.js"

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const movements = await getAllMovements()
        return res.status(200).json(movements)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.put('/change-state/:id', isAdminLogged, async (req, res) => {
    try{ 
        const { id } = req.params
        const { movement_state } = req.body
        const updatedMovement = await updateMovement(id, {movement_state})
        req.io.emit("movementsUpdate")
        res.status(200).json(updatedMovement)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/wallet-transactions/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await getUserById(id)
        const movements = await getUserTransactions(user)
        return res.status(200).json(movements)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/support-tickets/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await getUserById(id)
        const movements = await getUserTickets(user)
        return res.status(200).json(movements)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/wallet-transactions/:id/:dest', async (req, res) => {
    try {
        const { id, dest } = req.params
        const { transaction_amount, wallet_password } = req.body
        const type = dest == 'usd' ? 'usd-transfer' : 'inv-transfer'
        const movement = await performTransaction( id, type, parseFloat(transaction_amount), wallet_password )
        req.io.emit("usersUpdate")
        req.io.emit("movementsUpdate")
        res.status(200).json(movement)
    } catch(err) {
        errorHandler(res, err)
    }   
});

router.post('/make-deposit/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { transaction_amount } = req.body
        const movement = await performTransaction(id, 'deposit', parseFloat(transaction_amount));
        req.io.emit("movementsUpdate")
        res.status(200).json(movement)
    }    catch(err) {
        errorHandler(res, err)
    } 
}); 

router.post('/make-withdrawal/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { transaction_amount, wallet_password } = req.body
        const movement = await performTransaction(id, 'withdrawal', parseFloat(transaction_amount), wallet_password);
        req.io.emit("movementsUpdate")
        res.status(200).json(movement)
    } catch(err) {
        errorHandler(res, err)
    }
});

router.post('/make-support-ticket/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { description, category } = req.body
        const movement = await makeSupportTicket(id, description, category)
        req.io.emit("movementsUpdate")
        res.status(200).json(movement)        
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/approve-transaction/:id', async (req, res) => {
    try {
        const { received_amount } = req.body
        const { id } = req.params
        const updatedTransaction = await approveTransaction(id, parseFloat(received_amount))
        req.io.emit("clientsUpdate")
        req.io.emit("usersUpdate")
        req.io.emit("movementsUpdate") 
        res.status(200).json(updatedTransaction)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/reject-transaction/:id', async (req, res) => {
    try {
        const {id} = req.params
        await updateWalletTransaction(id, {movement_state: "rechazado"})
        req.io.emit("clientsUpdate")
        req.io.emit("usersUpdate")
        req.io.emit("movementsUpdate") 
    } catch(err) {
        errorHandler(res, err)
    }
})

export default router