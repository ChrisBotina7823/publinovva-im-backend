import { WalletTransaction } from "../model/models.js";

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

export {
    insertWalletTransaction,
    updateWalletTransaction,
    deleteWalletTransaction,
    getWalletTransactionById
}
