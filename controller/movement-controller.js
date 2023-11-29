import { Movement } from "../model/models.js";

// Insert a new movement
const insertMovement = async (movementJson) => {
    const movement = new Movement(movementJson);
    return await movement.save();
}

// Update movement by ID
const updateMovement = async (movementId, updatedData) => {
    return await Movement.findByIdAndUpdate(movementId, updatedData, { new: true });
}

// Delete movement by ID
const deleteMovement = async (movementId) => {
    return await Movement.findByIdAndDelete(movementId);
}

// Get movement by ID
const getMovementById = async (movementId) => {
    return await Movement.findById(movementId);
}

export {
    insertMovement,
    updateMovement,
    deleteMovement,
    getMovementById
}
