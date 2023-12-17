import express from 'express';
import upload from '../helpers/multer-config.js';
const router = express.Router();
config()
import { config } from 'dotenv';
import { insertUser, deleteUser, updateUser, getUserByUsername, updateFileAttribute, getAllUsers, getUserById } from '../controller/user-controller.js';
import { encryptPassword } from '../helpers/encryption.js';
import { errorHandler } from '../middlewares/login-md.js';
import { getAdminClients } from '../controller/admin-controller.js';
import { deleteWallet } from '../controller/wallet-controller.js';
import { getIdFromUrl } from '../helpers/object-depuration.js';
import { deleteFile } from '../helpers/drive-upload.js';
import { getMovementsByUser } from '../controller/movement-controller.js' 

// CRUD ROUTES

router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers()
        res.status(200).json(users)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/:username', async (req, res) => {
    try {
        const {username} = req.params
        const user = await getUserByUsername(username)
        res.status(200).json(user)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/id/:id', async (req, res) => {
    try {
        const {id} = req.params
        const user = await getUserById(id)
        res.status(200).json(user)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/', async (req, res) => {
        try {
            const { username, password, email } = req.body;
            const newUser = {
                username,
                password: await encryptPassword(password),
                email
            };
            const user = await insertUser(newUser);
            res.status(200).json(user);
        } catch (err) {
            errorHandler(res, err)
        }
    });

router.put('/:prevUsername', async (req, res) => {
    try {
        const { prevUsername } = req.params;
        // A user in general can only edit his profile.
        // A superuser can edit anyone's profile
        if(req.user.__t && req.user.username != prevUsername) throw new Error(`You do not have the permissions to edit this profile`)
        
        if(req.user.__t == 'Admin' && req.user.username != prevUsername) {
            const adminUsers = ( await getAdminClients(req.user.username) )
            const prevUser = adminUsers.find( u => u.username = prevUsername )
            if(!prevUser) throw new Error(`You do not have permissions to edit this client`)
        }

        const { username, email, profile_picture = undefined } = req.body;
        const newUser = {
            username,
            email,
            profile_picture
        };
        const updatedUser = await updateUser(prevUsername, newUser);
        res.status(200).json(updatedUser);
    } catch (err) {
        errorHandler(res, err)
    }
});

router.delete('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await getUserByUsername(username)
        if(user.__t == 'Client') {
            deleteWallet(user.i_wallet)
            deleteWallet(user.usd_wallet)
        }
        if(user.profile_picture) {
            deleteFile( getIdFromUrl(user.profile_picture) )
                .then(
                    () => {
                        console.log(`Deleted profile picture`)
                    }
                    )
                }
        await deleteUser(username);
        res.status(200).json({ message: `Deleted user ${username}` });
    } catch (err) {
        errorHandler(res, err)
    }
});

router.post('/profile-picture/:username', upload.single('profile_picture'), async (req, res) => {
    try {
        if(!req.file) throw new Error('You must upload a file')
        const { username } = req.params;

        const picture = req.file
        picture.originalname = Buffer.from(picture.originalname, 'ascii').toString('utf8')

        const updatedUser = await updateFileAttribute(username, process.env.DRIVE_PROFILE_PICTURE_FOLDER, picture, 'profile_picture');
        req.io.emit("usersUpdate")
        req.io.emit("adminsUpdate")
        req.io.emit("clientsUpdate")
        res.status(200).json(updatedUser);
    } catch (err) {
        errorHandler(res, err);
    }
})

router.get('/movements/:username', async (req, res) => {
    try {
        const { username } = req.params
        const user = await getUserByUsername(username)
        const wallets = await getMovementsByUser(user)
        res.status(200).json(wallets)
    } catch(err) {
        errorHandler(res, err)
    }
})

export default router;
