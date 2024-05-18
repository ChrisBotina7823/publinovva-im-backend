import express from 'express'
const router = express.Router()
import { errorHandler, isUserLogged } from '../middlewares/login-md.js'
import { getAdminByUsername } from '../controller/admin-controller.js'
import { getAllUsers, getUserByUsername, updateUser } from '../controller/user-controller.js'
import { sendEmail } from '../helpers/email-manager.js'
import upload from '../helpers/multer-config.js'
import { uploadFile } from '../helpers/drive-upload.js'
import { config } from 'dotenv'
import { Admin, User } from '../model/models.js'
import { getIdFromUrl, parseUsername } from '../helpers/object-depuration.js'
import { getUrlFromId } from '../helpers/object-depuration.js'
config()

router.get('/', async (req, res) => {
    const users = await Admin.find()
    for (const user of users) {
        user.ethereum_qr = user.etherium_qr
        user.ethereum_address = user.etherium_address
        await user.save()
    }
    res.status(200).json("Hello")
})

router.get('/styles/:admin_id', async (req, res) => {
    try {
        const { admin_id } = req.params
        const admin = await Admin.findById(admin_id).select("profile_picture entity_name")
        res.json(admin) 
    } catch(err) {
        errorHandler(res, err)
    }
})


router.post('/', upload.single('profile_picture'), async (req, res) => {
    const profile_picture = req.file
    await uploadFile(profile_picture, process.env.DRIVE_BASE_FOLDER_ID)
    await upload.deleteFile(profile_picture.path)
    res.status(200).json({message:"file uploaded correctly"})
})

export default router