import { deleteFile, uploadFile } from '../helpers/drive-upload.js';
import upload from '../helpers/multer-config.js';
import { getIdFromUrl, getUrlFromId } from '../helpers/object-depuration.js';
import { User }  from '../model/models.js';

const insertUser = async (userJson) => {
    const user = new User(userJson);
    return await user.save();
}

const updateUser = async (username, updatedData) => {
    await User.findOneAndUpdate({ username }, updatedData);
    return await User.findOne({ username });
}

const deleteUser = async (username) => {
    return await User.findOneAndDelete({ username });
}

const getUserByUsername = async (username) => {
    return await User.findOne({ username });
}

const getAllUsers = async () => {
    return await User.find({})
}

const getSuperUserByUsername = async (username) => {
    return await User.findOne({username, __t: undefined})
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
                await deleteFile(getIdFromUrl(previousImg));
                console.log(`File deleted from drive for ${attribute}`);
            }
        )
    user[attribute] = previewLink
    user.save()
}

export {
    insertUser,
    updateUser, 
    deleteUser,
    getUserByUsername,
    getAllUsers,
    getSuperUserByUsername,
    getUserByRecoveryToken,
    updateFileAttribute
}