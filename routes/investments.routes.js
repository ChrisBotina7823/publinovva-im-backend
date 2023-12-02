import express from "express";
import { beginInvestment, getAllInvestments, updateInvestment, updateInvestmentState } from "../controller/investment-controller.js";
import { errorHandler } from "../middlewares/login-md.js";

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const investments = await getAllInvestments()
        res.status(200).json(investments)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/:username', async (req, res) => {
    try{ 
        const { username } = req.params
        const { end_date, package_id, inv_amount } = req.body
        const investment = await beginInvestment(username, end_date, package_id, inv_amount)
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
        res.status(200).json(updatedInv)
    } catch(err) {
        errorHandler(res, err)
    }
})

export default router