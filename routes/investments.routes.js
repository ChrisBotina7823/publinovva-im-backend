import express from "express";
import { beginInvestment, calculateRevenue, generateInvestmentReport, getAllInvestments, getInvestmentById, getUserInvestments, updateInvestment, updateInvestmentState } from "../controller/investment-controller.js";
import { errorHandler, isAdminLogged } from "../middlewares/login-md.js";
import { getUserById } from "../controller/user-controller.js";

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

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const investment = await getInvestmentById(id);
        const stats = await calculateRevenue(investment)
        res.status(200).json({"investment": investment, "stats": stats})
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/revenues/:id', async (req, res) => {
    try {
        // const { id } = req.params
        // const client = await getUserById(id)
        // const revenues = await getClientRevenueTable(client._id)
        // res.status(200).json(revenues)
        res.status(200).json({})
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/report/:id', async (req, res) => {
    try {
        const { id } = req.params
        const report = await generateInvestmentReport(id)        
        res.status(200).json(report)
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
        req.io.emit("clientsUpdate")
        res.status(200).json(updatedInvestment)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.put('/:id', isAdminLogged, async (req, res) => {
    try {
        const { id } = req.params
        let { actual_start_date, end_date, state = undefined, time } = req.body
        const investment = await getInvestmentById(id)
        actual_start_date = new Date(actual_start_date)
        end_date = new Date(end_date)
        time = new Date(time)
        actual_start_date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds())
        end_date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds())
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