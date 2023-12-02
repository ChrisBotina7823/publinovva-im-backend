import { sendEmail } from "../helpers/email-manager.js";
import { calculateDayDiff, checkObj } from "../helpers/object-depuration.js";
import { Investment } from "../model/models.js";
import { getClientByUsername } from "./client-controller.js";
import { getPackageById } from "./package-controller.js";
import { getUserById } from "./user-controller.js";
import { getWalletById, updateWallet, updateWalletById } from "./wallet-controller.js";

// Insert a new investment
const insertInvestment = async (investmentJson) => {
    const investment = new Investment(investmentJson);
    return await investment.save();
}

// Update investment by ID
const updateInvestment = async (investmentId, updatedData) => {
    const inv = await Investment.findByIdAndUpdate(investmentId, updatedData, { new: true });
    inv.revenue = await calculateRevenue(inv)
    return inv
}

// Delete investment by ID
const deleteInvestment = async (investmentId) => {
    return await Investment.findByIdAndDelete(investmentId);
}

// Get investment by ID
const getInvestmentById = async (investmentId) => {
    const inv = await Investment.findById(investmentId);
    inv.revenue = await calculateRevenue(inv)
    return inv
}

const getAllInvestments = async () => {
    const inv =  await Investment.find({})
    inv.forEach( async i => i.revenue = await calculateRevenue(i)) 
    return inv
}

const beginInvestment = async (username, end_date, package_id, inv_amount ) => {
    let investmentInfo = {}

    const client = await getClientByUsername(username)
    checkObj(client, "client")
    const wallet = await getWalletById(client.i_wallet)
    investmentInfo.wallet = client.i_wallet
    const inv_package = await getPackageById(package_id)
    checkObj(inv_package, "inv_package")
    investmentInfo.package = inv_package

    if(inv_amount > wallet.available_amount) throw new Error(`Not enough balance in wallet ${wallet._id}`)

    if(inv_amount < inv_package.min_opening_amount) throw new Error(`The package ${inv_package.name} requires ${inv_package.min_opening_amount} available balance in Investment Wallet`)
    investmentInfo.inv_amount = inv_amount

    investmentInfo.end_date = new Date(end_date)
    const dayDiff = calculateDayDiff( new Date(), investmentInfo.end_date )
    if(dayDiff < inv_package.min_inv_days) throw new Error(`This package requires ${inv_package.min_inv_days} investment days minimum`)

    const investment = await insertInvestment(investmentInfo)
    sendEmail(client.email, "Solicitud de Inversión", "¡Hola! Tu solicitud de inversión se ha realizado correctamente. Se notificará al administrador para que responda a tu solicitud")
    sendEmail(client.email, "Solicitud de Inversión", `El cliente identificado con usuario ${client.username} ha realizado una solicitud de inversión. Revisa la plataforma para evaluar la solicitud`)

    return investment
}

const updateInvestmentState = async (id, state) => {
    let invInfo = {state}
    const investment = await getInvestmentById(id)
    checkObj(investment, "investment")
    const wallet = await getWalletById(investment.wallet)
    if(investment.state == state) throw new Error(`Investment ${id} status is already set to ${state}`)

    switch(state) {
        case "en curso":
            updateWalletById(wallet._id, {available_amount: wallet.available_amount - investment.inv_amount, actual_start_date: Date.now})
            invInfo.actual_start_date = Date.now() 
            break
        case "finalizado":
            updateWalletById(wallet._id, {available_amount: wallet.available_amount + investment.inv_amount + (await calculateRevenue(investment)) })
            break
        default:
            throw new Error(`Insert a valid state for investments`)
    }
    const updatedInv = await updateInvestment(id, invInfo)
    return updatedInv
}

const calculateRevenue = async (investment) => {
    if(!investment.actual_start_date) return 0
    const dayDiff = Math.min( 
        calculateDayDiff( investment.actual_start_date, new Date() ),
        calculateDayDiff( investment.actual_start_date, investment.end_date )
    ) 
    const inv_package = await getPackageById(investment.package)
    if(!inv_package) return 0
    const day_cnt = Math.floor(dayDiff / inv_package.revenue_freq)
    console.log(investment.inv_amount)
    console.log(day_cnt)
    console.log(inv_package.revenue_percentage)
    return day_cnt*inv_package.revenue_percentage*investment.inv_amount
}

export {
    insertInvestment,
    updateInvestment,
    deleteInvestment,
    getInvestmentById,
    getAllInvestments,
    beginInvestment,
    updateInvestmentState
}
