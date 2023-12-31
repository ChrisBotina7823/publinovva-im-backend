import { deleteFile, uploadFile } from '../helpers/drive-upload.js';
import upload from '../helpers/multer-config.js';
import { getIdFromUrl, getUrlFromId } from '../helpers/object-depuration.js';
import { Investment, User }  from '../model/models.js';
import { updateAdmin } from './admin-controller.js';
import { updateClient } from './client-controller.js';

const insertUser = async (userJson) => {
    const user = new User(userJson);
    return await user.save();
}

const updateUser = async (username, updatedData) => {
    return await User.findOneAndUpdate({ username }, updatedData);
}

const deleteUser = async (username) => {
    return await User.findOneAndDelete({ username });
}

const getUserByUsername = async (username) => {
    const user = await User.findOne({ username })
    if(user?.__t && user.__t == "Client") {
        const populateFields = [{path:"admin"}, {path:"usd_wallet"}, {path:"i_wallet"}]
        await User.populate(user, populateFields);
    }   
    return user;
}

const getAllUsers = async () => {
    return await User.find({})
}

const getSuperUserByUsername = async (username) => {
    return await User.findOne({username, __t: undefined})
}

const getUserById = async (id) => {
    const user = await User.findById(id)
    if(user?.__t && user.__t == "Client") {
        const populateFields = [{path:"admin"}, {path:"usd_wallet"}, {path:"i_wallet"}]
        await User.populate(user, populateFields);
    }  
    return user
}

const getUserByRecoveryToken = async (recovery_token) => {
    return await User.findOne({recovery_token}) 
}

const updateFileAttribute = async (username, folderId, file, attribute) => {
    const fileId = await uploadFile(file, folderId);
    const previewLink = getUrlFromId(fileId);

    const user = await getUserByUsername(username);
    const previousImg = user[attribute];

    upload.deleteFile(file.path)
        .then(
            async () => {
                try {
                    await deleteFile(getIdFromUrl(previousImg));
                } catch(err) {
                    console.error(`User does not have file ${previousImg}`)
                }
                console.log(`File deleted from drive for ${attribute}`);
            }
        )
    if(user.__t == "Admin") {
        return await updateAdmin(username, {[attribute]:previewLink})
    } else if(user.__t == "Client") {
        return await updateClient(username, {[attribute]:previewLink})
    } else {
        return await updateUser(username, {[attribute]:previewLink})
    }
}

export {
    insertUser,
    updateUser, 
    deleteUser,
    getUserByUsername,
    getAllUsers,
    getSuperUserByUsername,
    getUserByRecoveryToken,
    updateFileAttribute,
    getUserById
}