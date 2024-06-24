import express from 'express'
const router = express.Router()
import { errorHandler, isUserLogged } from '../middlewares/login-md.js'
import { getAdminByUsername } from '../controller/admin-controller.js'
import { getAllUsers, getUserByUsername, updateUser } from '../controller/user-controller.js'
import { sendEmail } from '../helpers/email-manager.js'
import upload from '../helpers/multer-config.js'
import { getFileById, uploadFile } from '../helpers/drive-upload.js'
import { config } from 'dotenv'
import {
    User,
    Admin,
    Client,
    Package,
    Wallet,
    Movement,
    WalletTransaction,
    SupportTicket,
    Investment
} from '../model/models.js'
import { getIdFromUrl, parseUsername } from '../helpers/object-depuration.js'
import { getUrlFromId } from '../helpers/object-depuration.js'
import { encryptPassword } from '../helpers/encryption.js'
import { getWalletInvestments } from '../controller/wallet-controller.js'
import { getAllPackages } from '../controller/package-controller.js'
config()

const updateFileAttr = async () => {
    const header = "https://drive.lienuc.com/uc?id="
    const newHeader = "https://publinovva-im-backend-production.up.railway.app/img/"
    let elements = await User.find({})
    for(const e of elements) {
        e.profile_picture = e.profile_picture.replace(header, newHeader)
        e.save()
    }
    elements = await Admin.find({})
    for(const e of elements) {
        e.ethereum_qr = e.ethereum_qr.replace(header, newHeader)
        e.btc_qr = e.btc_qr.replace(header, newHeader)
        e.usdt_qr = e.usdt_qr.replace(header, newHeader)
        e.save()
    }
}

router.get('/', async (req, res) => {
    await updateFileAttr()
    res.status(200).json("Hello")
})

router.get('/styles/:admin_id', async (req, res) => {
    try {
        const { admin_id } = req.params;
        let conditions = [ {_id: admin_id}, {username: parseUsername(admin_id)}, {shortId: admin_id}]
        for (const condition of conditions) {
            try {
                const admin = await Admin.findOne(condition).select("profile_picture entity_name shortId")
                if(admin) {
                    res.json(admin)
                    return
                }
            } catch(err) {
                continue
            }
        }
        res.status(404).json({message:"Admin not found"})
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

router.get('/img/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { stream, mimeType } = await getFileById(id);
        res.setHeader('Content-Type', mimeType);
        stream.pipe(res);
    } catch(err) {
        errorHandler(res, err);
    }
});

export default router