import { Package }  from '../model/models.js';

// Insert a new package
const insertPackage = async (packageJson) => {
    const newPackage = new Package(packageJson);
    return await newPackage.save();
}

// Update package by ID
const updatePackage = async (packageId, updatedData) => {
    return await Package.findByIdAndUpdate(packageId, updatedData, { new: true });
}

// Delete package by ID
const deletePackage = async (packageId) => {
    return await Package.findByIdAndDelete(packageId);
}

// Get package by ID
const getPackageById = async (packageId) => {
    return await Package.findById(packageId);
}

const getAllPackages = async () => {
    return await Package.find({})
}

const getUserPackages = async (user) => {
    const condition = user.__t == "Admin" ? {"admin":user._id} : user.__t == "Client"  ? {"client":user._id} : {}
    return await Package.find(condition)
}

export {
    insertPackage,
    updatePackage,
    deletePackage,
    getPackageById,
    getAllPackages,
    getUserPackages
}
