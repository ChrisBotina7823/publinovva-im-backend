import express from "express";
import { beginInvestment, getAllInvestments, getClientRevenueTable, getInvestmentById, updateInvestment, updateInvestmentState } from "../controller/investment-controller.js";
import { errorHandler } from "../middlewares/login-md.js";
import { getClientByUsername } from "../controller/client-controller.js";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const investments = await getAllInvestments()
        res.status(200).json(investments)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const investment = await getInvestmentById(id);
        res.status(200).json(investment)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/revenues/:username', async (req, res) => {
    try {
        const { username } = req.params
        const client = await getClientByUsername(username)
        const revenues = await getClientRevenueTable(client._id)
        res.status(200).json(revenues)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/:username', async (req, res) => {
    try{ 
        const { username } = req.params
        const { end_date, package_id, inv_amount } = req.body
        const investment = await beginInvestment(username, end_date, package_id, inv_amount)
        req.io.emit("investmentsUpdate")
        res.status(200).json(investment)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/change-state/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { state } = req.body
        const updatedInvestment = await updateInvestmentState(id, state)
        req.io.emit("investmentsUpdate")
        res.status(200).json(updatedInvestment)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { actual_start_date, end_date, state = undefined } = req.body
        const investmentInfo = {
            actual_start_date,
            end_date
        }
        console.log(state)
        if(state) await updateInvestmentState(id, state)
        const updatedInvestment = await updateInvestment(id, investmentInfo)
        req.io.emit("investmentsUpdate")
        res.status(200).json(updatedInvestment)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/update/:id', async (req, res) => {
    try {
        const { id } = req.params
        const updatedInfo = req.body
        const updatedInv = await updateInvestment(id, updatedInfo)
        req.io.emit("investmentsUpdate")
        res.status(200).json(updatedInv)
    } catch(err) {
        errorHandler(res, err)
    }
})

export default router