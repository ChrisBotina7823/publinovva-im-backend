import { parseUsername } from '../helpers/object-depuration.js';
import { Admin, Client, Package }  from '../model/models.js';

// Insert a new admin (inherits from User)
const insertAdmin = async (adminJson) => {
    adminJson.username = parseUsername(adminJson.username)
    const admin = new Admin(adminJson);
    return await admin.save();
}

// Update admin by username
const updateAdmin = async (id, updatedData) => {
    return await Admin.findByIdAndUpdate({ id }, updatedData, { new: true });
}

// Delete admin by username
const deleteAdmin = async (id) => {
    return await Admin.findByIdAndRemove({ id });
}

// Get admin by username
const getAdminByUsername = async (username) => {
    username = parseUsername(username)
    return await Admin.findOne({ username });
}

const getAdminClients = async (id) => {
    const clients = await Client.find({ admin: await Admin.findById(id) })
      .populate([
          { path: "admin", select: "shortId username btc_address btc_qr ethereum_address ethereum_qr" },
          { path: "usd_wallet", select: "shortId available_amount" },
          { path: "i_wallet", select: "shortId investment_amount available_amount" }
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
