import express from 'express'
const router = express.Router()
import { isUserLogged } from '../middlewares/login-md.js'
import { getAdminByUsername } from '../controller/admin-controller.js'
import { getAllUsers, getUserByUsername, updateUser } from '../controller/user-controller.js'
import { sendEmail } from '../helpers/email-manager.js'
import upload from '../helpers/multer-config.js'
import { uploadFile } from '../helpers/drive-upload.js'
import { config } from 'dotenv'
import { Investment } from '../model/models.js'
import { parseUsername } from '../helpers/object-depuration.js'
config()

router.get('/', async (req, res) => {
    const users = await getAllUsers();
    for(const user of users) {
        const username = parseUsername(user.username)
        await updateUser(user.username, {username})
    }
    const newUsers = await getAllUsers()
    res.status(200).json({newUsers})
})


router.post('/', upload.single('profile_picture'), async (req, res) => {
    const profile_picture = req.file
    await uploadFile(profile_picture, process.env.DRIVE_BASE_FOLDER_ID)
    await upload.deleteFile(profile_picture.path)
    res.status(200).json({message:"file uploaded correctly"})
})

export default router