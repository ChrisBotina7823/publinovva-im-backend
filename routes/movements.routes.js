import express from "express"
import bcrypt from 'bcrypt'
import { getAllMovements, insertMovement, updateMovement } from "../controller/movement-controller.js"
import { errorHandler, isAdminLogged } from '../middlewares/login-md.js'
import { getWalletById, updateWallet } from "../controller/wallet-controller.js"
import { getClientByUsername, updateClient } from "../controller/client-controller.js"
import { sendEmail } from "../helpers/email-manager.js"
import { getAdminByUsername } from "../controller/admin-controller.js"
import { approveTransaction, getUserTransactions, getWalletTransactionById, insertWalletTransaction, performTransaction, updateWalletTransaction } from "../controller/wallet-transaction-controller.js"
import { Admin } from "../model/models.js"
import { admin } from "googleapis/build/src/apis/admin/index.js"
import { resourcesettings } from "googleapis/build/src/apis/resourcesettings/index.js"
import { getUserTickets, makeSupportTicket } from "../controller/support-ticket-controller.js"
import { getUserById, getUserByUsername } from "../controller/user-controller.js"

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
        console.log("actualizado")
        console.log(updatedMovement)
        req.io.emit("movementsUpdate")
        res.status(200).json(updatedMovement)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/wallet-transactions/:username', async (req, res) => {
    try {
        const { username } = req.params
        const user = await getUserByUsername(username)
        const movements = await getUserTransactions(user)
        return res.status(200).json(movements)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/support-tickets/:username', async (req, res) => {
    try {
        const { username } = req.params
        const user = await getUserByUsername(username)
        const movements = await getUserTickets(user)
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
        const movement = await performTransaction( username, type, transaction_amount, wallet_password )
        req.io.emit("usersUpdate")
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
        req.io.emit("movementsUpdate")
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
        req.io.emit("movementsUpdate")
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
        const updatedTransaction = await approveTransaction(id, received_amount)
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