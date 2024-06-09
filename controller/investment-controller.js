import { differenceInDays } from "date-fns";
import { sendEmail } from "../helpers/email-manager.js";
import { calculateDayDiff, checkObj } from "../helpers/object-depuration.js";
import { Investment } from "../model/models.js";
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
    const inv = await Investment.findById(investmentId).populate([{path:"client"}, {path:"package"}]).exec();
    return inv
}

const getAllInvestments = async () => {
    const inv =  await Investment.find({}).populate([{path:"client", select:"shortId fullname"}, {path:"package", select:"shortId name revenue_freq revenue_percentage"}]).exec()
    console.log(inv)
    inv.forEach( async i => i.revenue = (await calculateRevenue(i)).total_revenue) 
    return inv
}

const getUserInvestments = async (user) => {
    const condition = user.__t == "Client"  ? {"client":user._id} : {}
    let inv =  await Investment.find(condition).populate([{path:"client", select:"shortId fullname admin"}, {path:"package", select:"shortId name revenue_freq revenue_percentage"}]).exec()
    // inv.forEach( async i => i.revenue = await calculateRevenue(i)) 

    for(let i of inv) {
        i.revenue = (await calculateRevenue(i)).total_revenue
    }

    if(user.__t == "Admin") {
        inv = inv.filter( i => i.client?.admin == user._id.toString() )
    }

    return inv
}

const beginInvestment = async (id, end_date, package_id, inv_amount ) => {
    let investmentInfo = {}

    const client = await getUserById(id)
    investmentInfo.client = client
    checkObj(client, "client")
    const wallet = await getWalletById(client.i_wallet)
    investmentInfo.wallet = client.i_wallet
    const inv_package = await getPackageById(package_id)
    checkObj(inv_package, "inv_package")
    const admin = await getUserById(client.admin)
    investmentInfo.package = inv_package
    
    if(inv_amount > wallet.available_amount) throw new Error(`No hay suficiente dinero en la billetera ${wallet._id}`)

    if(inv_amount < inv_package.min_opening_amount) throw new Error(`El monto es menor al requerido por el paquete ${inv_package.name}. Monto Mínimo: $${inv_package.min_opening_amount} `)
    investmentInfo.inv_amount = inv_amount

    const currentDate = new Date();
    end_date = new Date(end_date)
    end_date.setUTCHours(currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds(), currentDate.getUTCMilliseconds());
    investmentInfo.end_date = end_date
    const dayDiff = differenceInDays( investmentInfo.end_date, currentDate )
    if(dayDiff < inv_package.min_inv_days) throw new Error(`El paquete ${inv_package.name} requiere ${inv_package.min_inv_days} días de inversión mínimo`)

    const investment = await insertInvestment(investmentInfo)
    const clientMessage = `
    Hola ${client.fullname},<br>
    Tu solicitud de inversión ha sido recibida con éxito. A continuación, los detalles de tu inversión:<br>
    <ul>
        <li>Paquete: ${inv_package.name}</li>
        <li>Monto: $${inv_amount}</li>
        <li> Porcentaje de beneficio: ${inv_package.revenue_percentage}%</li>
        <li> Frecuencia de ingreso: Cada ${inv_package.revenue_freq} día(s)</li>
        <li>Fecha de inicio: ${currentDate.toISOString().split("T")[0]}</li>
        <li>Fecha de finalización: ${investmentInfo.end_date.toISOString().split("T")[0]}</li>
        </ul>
        <br>
        <p>Recuerda que puedes revisar el estado de tu inversión en cualquier momento en la plataforma.</p>
    `
    sendEmail(client.email, "Solicitud de Inversión", clientMessage)
    sendEmail(admin.email, "Solicitud de Inversión", `El cliente identificado con usuario ${client.username} ha realizado una solicitud de inversión. Revisa la plataforma para evaluar la solicitud`)

    return investment

}

const updateInvestmentState = async (id, state) => {
    let invInfo = {state}
    const investment = await getInvestmentById(id)
    checkObj(investment, "investment")
    const wallet = await getWalletById(investment.wallet)
    if(investment.state == state) throw new Error(`El estado ${id} ya está  ${state}`)
    if( statePhase[investment.state] > statePhase[state] ) throw new Error(`No es posible cambiar el estado de "${investment.state}" a "${state}"`)

    let clientMessage
    switch(state) {
        case "en curso":
            updateWalletById(wallet._id, {available_amount: wallet.available_amount - investment.inv_amount, actual_start_date: Date.now})
            invInfo.actual_start_date = Date.now() 
            break
        case "finalizado":
            clientMessage = `
            Hola ${investment.client.fullname},<br>
            Tu inversión ha finalizado con éxito. A continuación, los detalles de tu inversión:<br>
            <ul>
                <li> Ingreso total: $${(await calculateRevenue(investment)).total_revenue}</li>
                <li>Paquete: ${investment.package.name}</li>
                <li>Monto: $${investment.inv_amount}</li>
                <li> Porcentaje de beneficio: ${investment.package.revenue_percentage}%</li>
                <li> Frecuencia de ingreso: Cada ${investment.package.revenue_freq} día(s)</li>
                <li>Fecha de inicio: ${investment.actual_start_date.toISOString().split("T")[0]}</li>
                <li>Fecha de finalización: ${investment.end_date.toISOString().split("T")[0]}</li>
            </ul>
            <br>
            <p>Recuerda que puedes revisar el estado de tu inversión en cualquier momento en la plataforma.</p>`
            sendEmail(investment.client.email, "Inversión Finalizada", clientMessage)
            updateWalletById(wallet._id, {available_amount: wallet.available_amount + investment.inv_amount + (await calculateRevenue(investment)).total_revenue })
            break
        case "rechazado":
            clientMessage = `
            Hola ${investment.client.fullname},<br>
            Tu solicitud de inversión ha sido rechazada. Se reembolsará el monto de tu inversión a tu billetera de inversión.<br>
            <ul>
                <li>Monto: $${investment.inv_amount}</li>
                <li>Fecha de solicitud: ${investment.start_date.toISOString().split("T")[0]}</li>
            </ul>
            <br>
            <p>Recuerda que puedes revisar el estado de tu inversión en cualquier momento en la plataforma.</p>`
            sendEmail(investment.client.email, "Solicitud de Inversión Rechazada", clientMessage)
                
            if(investment.state == "en curso") {
                updateWalletById(wallet._id, {available_amount: wallet.available_amount + investment.inv_amount})
            }
            
            break
        default:
            throw new Error(`Insert a valid state for investments`)
    }
    
    const updatedInv = await updateInvestment(id, invInfo)
    return updatedInv
}

const calculateRevenue = async (investment) => {

    let total_revenue = 0;
    const revenues = [];
    const start_date = new Date(investment.actual_start_date || investment.start_date);
    const curr_date = new Date();
    const end_date = Math.min(new Date(investment.end_date), curr_date);
    const freq = investment.package.revenue_freq
    for(let day = new Date(start_date); day <= end_date; day.setDate(day.getDate() + 1)) {
        const days_diff = differenceInDays(day, start_date)
        if(days_diff && days_diff % freq == 0) {
            const revenue = investment.inv_amount * (investment.package.revenue_percentage / 100);
            total_revenue += revenue;
            revenues.push({ date: new Date(day), amount:revenue });
        }
    }
    return {
        "total_revenue": total_revenue,
        "revenues": revenues.reverse(),
    }
}


const isValid = investment => {
    return investment.package && investment.state != "pendiente" && investment.state != "rechazado"
}

const toDays = date => {
    return Math.floor(date / (1000 * 60 * 60 * 24));
}

const generateInvestmentReport = async (id) => {
    const client = await getUserById(id)
    const investments = await getUserInvestments(client)
    let total_invested = 0, total_revenue = 0;
    const today = new Date();
    for(const investment of investments) {
        if(!isValid(investment)) continue; // Skip if the investment is invalid
        const start_date = new Date(investment.actual_start_date || investment.start_date);
        const end_date =  Math.min( new Date(investment.end_date), today );

        const freq = investment.package.revenue_freq
        const days_diff = differenceInDays(end_date, start_date)
        const revenue_days = Math.floor(days_diff / freq)
        total_invested += investment.inv_amount
        total_revenue += revenue_days * (investment.inv_amount * (investment.package.revenue_percentage / 100))
    }
    let daily_revenue = Array(7).fill(0);
    let day_idx = Array(7).fill(0);
    for(let i = 6; i >= 0; i--) { // Loop over the last 7 days
        const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        day.setHours(today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds());
        day_idx[6 - i] = day.getDay();

        for(const investment of investments) {
            if(!isValid(investment)) continue; // Skip if the investment is invalid
            const start_date = new Date(investment.actual_start_date || investment.start_date);
            if(start_date > day) continue; // Skip if the investment hasn't started yet
            if(investment.end_date < day) continue; // Skip if the investment has ended
            const freq = investment.package.revenue_freq

            const days_diff = differenceInDays(day, start_date)
            if( days_diff && days_diff % freq == 0 ) {
                const revenue = investment.inv_amount * (investment.package.revenue_percentage / 100);
                daily_revenue[6 - i] += revenue;
            }        
        }
    }

    const chart = {
        labels: day_idx.map( i => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i] ),
        datasets: [{ label: "Revenue", data: daily_revenue }],
    }
    
    return {
        "total_revenue": total_revenue,
        "total_invested": total_invested,
        "chart": chart,
    }
}

const checkInvestments = async () => {
    // console.log("Checking investments")
    const investments = await Investment.find({state: "en curso"}).exec();
    const today = new Date();
    const updatePromises = [];

    for(const investment of investments) {
        const end_date = new Date(investment.end_date);
        if(end_date < today) {
            console.log("finished")
            updatePromises.push(updateInvestmentState(investment._id, "finalizado"));
        } else {
            console.log("not finished")
        }
    }

    await Promise.all(updatePromises);
}

export {
    insertInvestment,
    updateInvestment,
    deleteInvestment,
    getInvestmentById,
    getAllInvestments,
    beginInvestment,
    updateInvestmentState,
    getUserInvestments,
    generateInvestmentReport,
    calculateRevenue,
    checkInvestments
}
