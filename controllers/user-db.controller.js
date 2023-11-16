import db from "../db/db-connection.js";

const getUserByUsername = async username => {
    const [ users ] = await db.promise().query('SELECT * FROM USERS WHERE USERNAME = ?', [username])
    if(!users.length) return undefined
    let user = users[0]
    user.role = "superuser"
    return user
}

const registerUser = async newUser => {
    await db.promise().query('INSERT INTO USERS SET ?', [newUser])
}

const deleteUser = async username => {
    await db.promise().query('DELETE FROM USERS WHERE USERNAME = ?', [username])
}

const updateUser = async newUser => {
    await db.promise().query('UPDATE USERS SET ?', [newUser])
}

export {
    registerUser,
    updateUser,
    deleteUser,
    getUserByUsername
}