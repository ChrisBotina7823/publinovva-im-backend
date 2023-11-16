import db from "../db/db-connection.js";

// GET

const getUserByUsername = async username => {
    const [ users ] = await db.promise().query('SELECT * FROM USERS WHERE USERNAME = ? AND NOT EXISTS (SELECT * FROM CLIENTS WHERE USERNAME = ?) AND NOT EXISTS (SELECT * FROM ADMINS WHERE USERNAME = ?)', [username, username, username])
    if(!users.length) return undefined
    let user = users[0]
    user.role = "superuser"
    return user
}
const getAdminByUsername = async username => {
    const [ users ] = await db.promise().query('SELECT * FROM USERS U INNER JOIN ADMINS A ON U.USERNAME = A.USERNAME WHERE A.USERNAME = ?', [username])
    if(!users.length) return undefined
    let user = users[0]
    user.role = "admin"
    return user
}
const getClientByUsername = async username => {
    const [ users ] = await db.promise().query('SELECT * FROM USERS U INNER JOIN CLIENTS C ON U.USERNAME = C.USERNAME WHERE C.USERNAME = ?', [username])
    if(!users.length) return undefined
    let user = users[0]
    user.role = "client"
    return user
}

// REGISTER

const registerUser = async newUser => {
    await db.promise().query('INSERT INTO USERS SET ?', [newUser])
}
const registerAdmin = async newAdmin => {
    await db.promise().query('INSERT INTO ADMINS SET ?', [newAdmin])
}
const registerClient = async newClient => {
    await db.promise().query('INSERT INTO CLIENTS SET ?', [newClient])
}

// DELETE

const deleteUser = async username => {
    await db.promise().query('DELETE FROM USERS WHERE USERNAME = ?', [username])
}

// UPDATE

const updateUser = async newUser => {
    await db.promise().query('UPDATE USERS SET ?', [newUser])
}

export {
    getUserByUsername,
    getAdminByUsername,
    getClientByUsername,
    registerUser,
    registerAdmin,
    registerClient,
    updateUser,
    deleteUser
}