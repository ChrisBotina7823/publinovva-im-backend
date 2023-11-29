import { Admin, Client, Package }  from '../model/models.js';

// Insert a new admin (inherits from User)
const insertAdmin = async (adminJson) => {
    const admin = new Admin(adminJson);
    return await admin.save();
}

// Update admin by username
const updateAdmin = async (username, updatedData) => {
    return await Admin.findOneAndUpdate({ username }, updatedData, { new: true });
}

// Delete admin by username
const deleteAdmin = async (username) => {
    return await Admin.findOneAndDelete({ username });
}

// Get admin by username
const getAdminByUsername = async (username) => {
    return await Admin.findOne({ username });
}

const getAdminClients = async (username) => {
    return await Client.find({admin: await getAdminByUsername(username)})
}

const getAdminPackages = async (username) => {
    return await Package.find( {admin: await getAdminByUsername(username)} )
}

const getAllAdmins = async () => {
    return await Admin.find({})
}

export {
    insertAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminByUsername,
    getAdminClients,
    getAdminPackages,
    getAllAdmins
}
