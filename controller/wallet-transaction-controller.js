import { errorHandler } from "../middlewares/login-md.js";
import { Wallet, WalletTransaction } from "../model/models.js";
import { getWalletById, updateWalletById } from "./wallet-controller.js";
import { checkPassword } from "../helpers/encryption.js"
import { sendEmail } from "../helpers/email-manager.js";
import { getUserById } from "./user-controller.js";
import { boldStyle } from "../helpers/messages.js";

// Insert a new wallet transaction (inherits from Movement)
const insertWalletTransaction = async (walletTransactionJson) => {
    const walletTransaction = new WalletTransaction(walletTransactionJson);
    return await walletTransaction.save();
}

// Update wallet transaction by ID
const updateWalletTransaction = async (walletTransactionId, updatedData) => {
    return await WalletTransaction.findByIdAndUpdate(walletTransactionId, updatedData, { new: true });
}

// Delete wallet transaction by ID
const deleteWalletTransaction = async (walletTransactionId) => {
    return await WalletTransaction.findByIdAndDelete(walletTransactionId);
}

// Get wallet transaction by ID
const getWalletTransactionById = async (walletTransactionId) => {
    return await WalletTransaction.findById(walletTransactionId);
}

const getUserTransactions = async (user) => {
    const condition = user.__t == "Admin" ? {"admin":user._id} : user.__t == "Client"  ? {"client":user._id} : {}    
    return WalletTransaction.find(condition).populate([{path:"client", select:"shortId fullname"}, {path:"admin"}]).exec()
}

const performTransaction = async (id, type, transaction_amount, wallet_password) => {
    let transactionInfo = {}

    // obtain client and admin information
    const client = await getUserById(id);
    if(!client) throw new Error(`Client ${id} not found`)
    const admin = await getUserById(client.admin)
    transactionInfo.client = client
    transactionInfo.admin = client.admin
    transactionInfo.transaction_amount = transaction_amount

    let transactionType
    switch (type) {
        case 'usd-transfer':
            transactionInfo.dest_wallet = await getWalletById(client.usd_wallet)
            transactionInfo.origin_wallet = await getWalletById(client.i_wallet)
            transactionInfo.movement_state = "aprobado"
            transactionType = 'transferencia a billetera USD'
            break
        case 'inv-transfer':
            transactionInfo.dest_wallet = await getWalletById(client.i_wallet)
            transactionInfo.origin_wallet = await getWalletById(client.usd_wallet)
            transactionInfo.movement_state = "aprobado"
            transactionType = 'transferencia a billetera de Comercio'
            break
        case 'deposit':
            transactionInfo.dest_wallet = await getWalletById(client.usd_wallet)
            transactionType = 'deposito a billetera USD'
            break
        case 'withdrawal':
            transactionInfo.origin_wallet = await getWalletById(client.usd_wallet)
            transactionType = 'retiro desde billetera USD'    
            break
        default:
            throw new Error(`Enter a valid wallet transaction type`)
    }
    console.log(transactionType)
    console.log(transactionInfo.dest_wallet)
    console.log(transactionInfo.origin_wallet)
    transactionInfo.transaction_type = type

    // check credentials and balance
    const { origin_wallet, dest_wallet } = transactionInfo
    if(origin_wallet ) {
        const match = await checkPassword(wallet_password, origin_wallet.password)
        if(!match) throw new Error(`Invalid password for wallet ${origin_wallet._id}`)

        const enoughBalance = origin_wallet.available_amount >= transaction_amount
        if(!enoughBalance) throw new Error(`Not enough balance in wallet ${origin_wallet._id}`)
        if(type == 'usd-transfer' || type == 'inv-transfer') {
            await updateWalletById(origin_wallet._id.toString(), {available_amount: origin_wallet.available_amount - transaction_amount})
            await updateWalletById(dest_wallet._id.toString(), {available_amount: dest_wallet.available_amount + transaction_amount})
        }
    }


    const originInfo = origin_wallet ? `<br> - ${boldStyle("Billetera origen:")} ${origin_wallet._id} (${origin_wallet.type})` : ""
    const destInfo = dest_wallet ? `<br> - ${boldStyle("Billetera destino:")} ${dest_wallet._id} (${dest_wallet.type})` : ""
    const emailDesc = `Se ha realizado una solicitud de ${boldStyle(transactionType)}<br> - ${boldStyle("Cliente: ")} ${client.username}<br> - ${boldStyle("Monto: ")} ${transaction_amount}${originInfo}${destInfo}`

    if(type != 'usd-transfer' && type != 'inv-transfer') {
        sendEmail(client.email, `Solicitud de ${transactionType} realizada`, emailDesc)
        sendEmail(admin.email, `Solicitud de ${transactionType}`, emailDesc)
    }

    return await insertWalletTransaction(transactionInfo);
};

const approveTransaction = async (id, received_amount) => {
    const transaction = await WalletTransaction.findById(id)
        .populate([{path:"origin_wallet dest_wallet", select:"shortId available_amount"}, {path:"client"}])
        .exec()
    if(transaction.transaction_type == "withdrawal") {
        const { origin_wallet } = transaction
        if(origin_wallet.available_amount < received_amount) {
            throw new Error(`La billetera ${origin_wallet._id} no tiene los suficientes fondos para el retiro`)
        }
        await updateWalletById(origin_wallet, {available_amount: origin_wallet.available_amount - received_amount})
        sendEmail(transaction.client.email, `Retiro de billetera USD aprobado`, `Se ha aprobado el retiro de ${received_amount} USD de su billetera`)
    } else {
        const { dest_wallet } = transaction
        await updateWalletById(dest_wallet, {available_amount: dest_wallet.available_amount + received_amount})
        sendEmail(transaction.client.email, `Deposito a billetera USD aprobado`, `Se ha aprobado el depósito de ${received_amount} USD a su billetera`)
    }

    return await WalletTransaction.findByIdAndUpdate(id, {movement_state:"resuelto", received_amount: received_amount})
}

export {
    insertWalletTransaction,
    updateWalletTransaction,
    deleteWalletTransaction,
    getWalletTransactionById,
    performTransaction,
    getUserTransactions,
    approveTransaction
}
