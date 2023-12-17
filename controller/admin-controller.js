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
    const clients = await Client.find({ admin: await getAdminByUsername(username) })
      .populate([
          { path: "admin", select: "username deposit_address deposit_qr" },
          { path: "usd_wallet", select: "available_amount" },
          { path: "i_wallet", select: "investment_amount available_amount" }
      ])
      .exec();

    return clients;
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
