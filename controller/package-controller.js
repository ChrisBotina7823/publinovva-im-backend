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

export {
    insertPackage,
    updatePackage,
    deletePackage,
    getPackageById
}
