import { Investment, Wallet } from "../model/models.js";
import { getClientByUsername, updateClient } from "./client-controller.js";

// Insert a new wallet
const insertWallet = async (walletJson) => {
    const wallet = new Wallet(walletJson);
    return await wallet.save();
}

// Update wallet by ID
const updateWallet = async (username, type, updatedData) => {
    const user = await getClientByUsername(username)
    const wallet_id = type == 'usd' ? user.usd_wallet : user.i_wallet
    return await Wallet.findByIdAndUpdate(wallet_id, updatedData);
}

const updateWalletById = async (id, updatedData) => {
    return await Wallet.findByIdAndUpdate(id, updatedData)
}

// Delete wallet by ID
const deleteWallet = async (walletId) => {
    return await Wallet.findByIdAndDelete(walletId);
}

// Get wallet by ID
const getWalletById = async (walletId) => {
    const wallet = await Wallet.findById(walletId);
    wallet.total_amount = wallet.investment_amount + wallet.available_amount
    return wallet
}

const getWalletInvestments = async (walletId) => {
    return await Investment.find( {wallet: await getWalletById(walletId)} )
}

const assignWalletToClient = async (client, admin, usd_json, i_json) => {
    const usd_wallet = await insertWallet(usd_json)
    const i_wallet = await insertWallet(i_json)
    
    usd_wallet.client = i_wallet.client = client
    usd_wallet.admin = i_wallet.admin = admin
    usd_wallet.address = usd_wallet._id.toString()
    await usd_wallet.save()
    await i_wallet.save()

    return await updateClient(client._id, {usd_wallet, i_wallet})
}

const getAllWallets = async () => {
    let wallets = await Wallet.find({})
    wallets.forEach( w => w.total_amount = w.investment_amount + w.available_amount )
    return wallets
}


export {
    insertWallet,
    updateWallet,
    deleteWallet,
    getWalletById,
    getWalletInvestments,
    assignWalletToClient,
    getAllWallets,
    updateWalletById
}
