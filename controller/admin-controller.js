import { deleteFile } from '../helpers/drive-upload.js';
import { getIdFromUrl, parseUsername } from '../helpers/object-depuration.js';
import { Admin, Client, Package }  from '../model/models.js';

// Insert a new admin (inherits from User)
const insertAdmin = async (adminJson) => {
    adminJson.username = parseUsername(adminJson.username)
    const foundAdmin = await Admin.findOne({ $or: [{username: adminJson.username}, {email: adminJson.email}] });
    if(foundAdmin) {
        throw new Error("El nombre de usuario o correo electrónico ya está en uso")
    }
    const admin = new Admin(adminJson);
    return await admin.save();
}

// Update admin by username
const updateAdmin = async (id, updatedData) => {
    return await Admin.findByIdAndUpdate(id, updatedData, { new: true });
}

// Delete admin by username
const deleteAdmin = async (id) => {
    const admin = await Admin.findById(id)
    const clients = await Client.find({ admin: admin })
    if(clients.length > 0) {
        throw new Error("No se puede eliminar un administrador con clientes asociados")
    }
    const packages = await Package.find({ admin: admin })
    if(packages.length > 0) {
        throw new Error("No se puede eliminar un administrador con paquetes asociados")
    }
    try {
        if(admin.profile_picture) await deleteFile(getIdFromUrl(admin.profile_picture))
        if(admin.btc_qr) await deleteFile(getIdFromUrl(admin.btc_qr))
        if(admin.ethereum_qr) await deleteFile(getIdFromUrl(admin.ethereum_qr))
        if(admin.usdt_qr) await deleteFile(getIdFromUrl(admin.usdt_qr))
    } catch(err) {
        console.error(err)
    }
    return await Admin.findByIdAndDelete(id);
}

// Get admin by username
const getAdminByUsername = async (username) => {
    username = parseUsername(username)
    return await Admin.findOne({ $or: [{username}, {email:username}] });
}

const getAdminById = async (id) => {
    return await Admin.findById(id)
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
    getAllAdmins,
    getAdminById
}
