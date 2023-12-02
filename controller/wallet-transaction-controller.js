import { errorHandler } from "../middlewares/login-md.js";
import { WalletTransaction } from "../model/models.js";
import { getClientByUsername } from "./client-controller.js";
import { getWalletById } from "./wallet-controller.js";
import { checkPassword } from "../helpers/encryption.js"
import { sendEmail } from "../helpers/email-manager.js";
import { getAdminByUsername } from "./admin-controller.js";
import { getUserById } from "./user-controller.js";

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

const performTransaction = async (username, type, transaction_amount, wallet_password) => {
    let transactionInfo = {}

    // obtain client and admin information
    const client = await getClientByUsername(username);
    if(!client) throw new Error(`Client ${username} not found`)
    const admin = await getUserById(client.admin)
    transactionInfo.client = client
    transactionInfo.admin = client.admin
    transactionInfo.transaction_amount = transaction_amount

    let transactionType
    switch (type) {
        case 'usd-transfer':
            transactionInfo.dest_wallet = await getWalletById(client.usd_wallet)
            transactionInfo.origin_wallet = await getWalletById(client.i_wallet)
            transactionType = 'transferencia a billetera USD'
            break
        case 'inv-transfer':
            transactionInfo.dest_wallet = await getWalletById(client.i_wallet)
            transactionInfo.origin_wallet = await getWalletById(client.usd_wallet)
            transactionType = 'transferencia a billetera de Inversiones'
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

    // check credentials and balance
    const { origin_wallet, dest_wallet } = transactionInfo
    if(origin_wallet ) {
        const match = await checkPassword(wallet_password, origin_wallet.password)
        if(!match) throw new Error(`Invalid password for wallet ${origin_wallet._id}`)

        const enoughBalance = origin_wallet.available_amount >= transaction_amount
        if(!enoughBalance) throw new Error(`Not enough balance in wallet ${origin_wallet._id}`)
    }

    const originInfo = origin_wallet ? `\n - Billetera origen: ${origin_wallet._id} (${origin_wallet.type})` : ""
    const destInfo = dest_wallet ? `\n - Billetera destino: ${dest_wallet._id} (${dest_wallet.type})` : ""
    const emailDesc = `Se ha realizado una solicitud de ${transactionType}\n - Cliente: ${username}\n - Monto: ${transaction_amount}${originInfo}${destInfo}`

    sendEmail(client.email, `Solicitud de ${transactionType} realizada`, emailDesc)
    sendEmail(admin.email, `Solicitud de ${transactionType}`, emailDesc)

    return await insertWalletTransaction(transactionInfo);
};

export {
    insertWalletTransaction,
    updateWalletTransaction,
    deleteWalletTransaction,
    getWalletTransactionById,
    performTransaction
}
