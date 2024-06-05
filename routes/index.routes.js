import express from 'express'
const router = express.Router()
import { errorHandler, isUserLogged } from '../middlewares/login-md.js'
import { getAdminByUsername } from '../controller/admin-controller.js'
import { getAllUsers, getUserByUsername, updateUser } from '../controller/user-controller.js'
import { sendEmail } from '../helpers/email-manager.js'
import upload from '../helpers/multer-config.js'
import { uploadFile } from '../helpers/drive-upload.js'
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

router.get('/', async (req, res) => {
    // const models = [
    //     User,
    //     Admin,
    //     Client,
    //     Package,
    //     Wallet,
    //     Movement,
    //     WalletTransaction,
    //     SupportTicket,
    //     Investment]
    // for(const model of models) {
    //     model.deleteMany({}).then( () => {
    //         console.log("Deleted all" + model.modelName)
    //     })
    // }

    // await User.deleteMany({})
    // const user = new User({
    //     username: "publinovva",
    //     password: await encryptPassword("123"),
    //     email: "publinovva@gmail.com",
    // }) 
    // await user.save()
    const admins = await Admin.find({})
    for(const admin of admins) {
        admin.ethereum_address = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)  
        admin.ethereum_link = "https://coinmarketcap.com/currencies/ethereum/"
        admin.ethereum_qr = "https://images.unsplash.com/photo-1709038459415-8379ce8ae789?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcxNzM0OTk5MQ&ixlib=rb-4.0.3&q=80&w=200"
        admin.btc_address = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)   
        admin.btc_link = "https://coinmarketcap.com/currencies/bitcoin/"
        admin.btc_qr = "https://images.unsplash.com/photo-1707400711977-328a8a52b416?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcxNzM1MDAxOA&ixlib=rb-4.0.3&q=80&w=200"
        admin.usdt_address = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)  
        admin.usdt_link = "https://coinmarketcap.com/currencies/tether/"
        admin.usdt_qr = "https://images.unsplash.com/photo-1709777618320-c1c8548f3942?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcxNzM1MDAyOA&ixlib=rb-4.0.3&q=80&w=200"
        await admin.save();
    }
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

export default router