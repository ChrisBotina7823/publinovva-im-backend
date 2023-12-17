import express from 'express';
import {
    insertPackage,
    getAllPackages,
    getPackageById,
    updatePackage,
    deletePackage,
} from '../controller/package-controller.js';
import { errorHandler, isAdminLogged } from '../middlewares/login-md.js';
import { getAdminByUsername } from '../controller/admin-controller.js';

const router = express.Router();

// Crear un nuevo paquete
router.post('/', isAdminLogged, async (req, res) => {
    try {
        const packageData = req.body;
        packageData.admin = await getAdminByUsername(req.body.admin_username)
        if(!packageData.admin) throw new Error(`Admin not found, cannot assign package`)
        const newPackage = await insertPackage(packageData);
        req.io.emit("packagesUpdate")
        res.status(201).json(newPackage);
    } catch (err) {
        errorHandler(res, err);
    }
});

// Obtener todos los paquetes
router.get('/', async (req, res) => {
    try {
        const packages = await getAllPackages();
        res.status(200).json(packages);
    } catch (err) {
        errorHandler(res, err);
    }
});

// Obtener un paquete por ID
router.get('/:id', isAdminLogged, async (req, res) => {
    try {
        const { id } = req.params;
        const newPackage = await getPackageById(id);
        res.status(200).json(newPackage);
    } catch (err) {
        errorHandler(res, err);
    }
});

// Actualizar un paquete por ID
router.put('/:id', isAdminLogged, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        if(updatedData.admin_username) {
            updatedData.admin = await getAdminByUsername(updatedData.admin_username)
            if(!updatedData.admin) throw new Error(`Cannot assign package to ${updatedData.admin_username}`)
        }
        const updatedPackage = await updatePackage(id, updatedData);
        if(!updatedPackage) throw new Error(`Package ${id} not found`)
        req.io.emit("packagesUpdate")
        res.status(200).json(updatedPackage);
    } catch (err) {
        errorHandler(res, err);
    }
});

// Eliminar un paquete por ID
router.delete('/:id', isAdminLogged, async (req, res) => {
    try {
        const { id } = req.params;
        await deletePackage(id);
        req.io.emit("packagesUpdate")
        res.status(200).json({message:`Package ${id} deleted successfully`});
    } catch (err) {
        errorHandler(res, err);
    }
});

export default router;
