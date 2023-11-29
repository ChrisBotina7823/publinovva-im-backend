import { Investment, Wallet } from "../model/models.js";

// Insert a new wallet
const insertWallet = async (walletJson) => {
    const wallet = new Wallet(walletJson);
    return await wallet.save();
}

// Update wallet by ID
const updateWallet = async (walletId, updatedData) => {
    return await Wallet.findByIdAndUpdate(walletId, updatedData, { new: true });
}

// Delete wallet by ID
const deleteWallet = async (walletId) => {
    return await Wallet.findByIdAndDelete(walletId);
}

// Get wallet by ID
const getWalletById = async (walletId) => {
    return await Wallet.findById(walletId);
}

const getWalletInvestments = async (walletId) => {
    return await Investment.find( {wallet: await getWalletById(walletId)} )
}

export {
    insertWallet,
    updateWallet,
    deleteWallet,
    getWalletById,
    getWalletInvestments
}
