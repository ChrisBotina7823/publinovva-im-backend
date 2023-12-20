import { sendEmail } from "../helpers/email-manager.js";
import { calculateDayDiff, checkObj } from "../helpers/object-depuration.js";
import { Investment } from "../model/models.js";
import { getClientByUsername } from "./client-controller.js";
import { getPackageById } from "./package-controller.js";
import { getUserById } from "./user-controller.js";
import { getWalletById, updateWallet, updateWalletById } from "./wallet-controller.js";

const statePhase = {
    "pendiente": 0,
    "en curso": 1,
    "rechazado": 1,
    "finalizado": 2,
}

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
    const inv =  await Investment.find({}).populate([{path:"client", select:"shortId fullname"}, {path:"package", select:"shortId name"}]).exec()
    inv.forEach( async i => i.revenue = await calculateRevenue(i)) 
    return inv
}

const beginInvestment = async (username, end_date, package_id, inv_amount ) => {
    let investmentInfo = {}

    const client = await getClientByUsername(username)
    investmentInfo.client = client
    checkObj(client, "client")
    const wallet = await getWalletById(client.i_wallet)
    investmentInfo.wallet = client.i_wallet
    const inv_package = await getPackageById(package_id)
    checkObj(inv_package, "inv_package")
    investmentInfo.package = inv_package

    if(inv_amount > wallet.available_amount) throw new Error(`No hay suficiente dinero en la billetera ${wallet._id}`)

    if(inv_amount < inv_package.min_opening_amount) throw new Error(`El monto es menor al requerido por el paquete ${inv_package.name}. Monto Mínimo: $${inv_package.min_opening_amount} `)
    investmentInfo.inv_amount = inv_amount

    investmentInfo.end_date = new Date(end_date)
    const dayDiff = calculateDayDiff( new Date(), investmentInfo.end_date )
    if(dayDiff < inv_package.min_inv_days) throw new Error(`El paquete ${inv_package.name} requiere ${inv_package.min_inv_days} días de inversión mínimo`)

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
    if(investment.state == state) throw new Error(`El estado ${id} ya está  ${state}`)
    if( statePhase[investment.state] > statePhase[state] ) throw new Error(`No es posible cambiar el estado de "${investment.state}" a "${state}"`)

    switch(state) {
        case "en curso":
            updateWalletById(wallet._id, {available_amount: wallet.available_amount - investment.inv_amount, actual_start_date: Date.now})
            invInfo.actual_start_date = Date.now() 
            break
        case "finalizado":
            updateWalletById(wallet._id, {available_amount: wallet.available_amount + investment.inv_amount + (await calculateRevenue(investment)) })
            break
        case "rechazado":
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
    return day_cnt*inv_package.revenue_percentage*investment.inv_amount
}

const getClientRevenueTable = async (id) => {
    const investments = await Investment.find({client:id})
        .populate([{path:"wallet", select:"investment_amount"}, {path:"package", select:"shortId revenue_percentage revenue_freq"}])
        .exec()
    const revenueTables = await Promise.all(investments.map(calculateRevenueTable));
    return revenueTables.flat();
}

const calculateRevenueTable = (investment) => {
    if (!investment.actual_start_date || investment.state == 'pendiente' == investment.state == "rechazado") return [];

    const revenueTable = [];
    const { inv_amount, actual_start_date, end_date } = investment;
    const { revenue_percentage, revenue_freq } = investment.package


    const currentDate = new Date(actual_start_date);

    const endDate = new Date(end_date)

    const revenue_amount = inv_amount * revenue_percentage;

    const todayDate = new Date()

    while (currentDate <= endDate && currentDate <= todayDate) {
        const days_diff = Math.floor((currentDate - actual_start_date) / (1000 * 60 * 60 * 24));
        revenueTable.push({
            date: currentDate.toISOString(),
            days_diff,
            revenue_amount,
            investment: investment.shortId || investment._id
        });

        currentDate.setDate(currentDate.getDate() + revenue_freq);
    }

    return revenueTable;
};


export {
    insertInvestment,
    updateInvestment,
    deleteInvestment,
    getInvestmentById,
    getAllInvestments,
    beginInvestment,
    updateInvestmentState,
    getClientRevenueTable
}
