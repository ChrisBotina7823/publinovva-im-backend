import express from "express";
import { beginInvestment, getAllInvestments, getClientRevenueTable, getInvestmentById, getUserInvestments, updateInvestment, updateInvestmentState } from "../controller/investment-controller.js";
import { errorHandler, isAdminLogged } from "../middlewares/login-md.js";

const router = express.Router()

router.get('/', isAdminLogged, async (req, res) => {
    try {
        const investments = await getAllInvestments()
        res.status(200).json(investments)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await getUserById(id)
        const investments = await getUserInvestments(user)
        res.status(200).json(investments)
    } catch(err) {
        errorHandler(res, err)
    }
} )

router.get('/:id', isAdminLogged, async (req, res) => {
    try {
        const { id } = req.params;
        const investment = await getInvestmentById(id);
        res.status(200).json(investment)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/revenues/:id', async (req, res) => {
    try {
        const { id } = req.params
        const client = await getUserById(id)
        const revenues = await getClientRevenueTable(client._id)
        res.status(200).json(revenues)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/:id', async (req, res) => {
    try{ 
        const { id } = req.params
        const { end_date, package_id, inv_amount } = req.body
        const investment = await beginInvestment(id, end_date, package_id, inv_amount)
        req.io.emit("investmentsUpdate")
        res.status(200).json(investment)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/change-state/:id', isAdminLogged, async (req, res) => {
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

router.put('/:id', isAdminLogged, async (req, res) => {
    try {
        const { id } = req.params
        const { actual_start_date, end_date, state = undefined } = req.body
        const investmentInfo = {
            actual_start_date,
            end_date
        }
        if(state) await updateInvestmentState(id, state)
        const updatedInvestment = await updateInvestment(id, investmentInfo)
        req.io.emit("investmentsUpdate")
        res.status(200).json(updatedInvestment)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/update/:id', isAdminLogged, async (req, res) => {
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