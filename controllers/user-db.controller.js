import db from "../db/db-connection.js";

const getUserByUsername = async username => {
    const [ users ] = await db.promise().query('SELECT * FROM USERS WHERE USERNAME = ?', [username])
    return users.length ? users[0] : undefined
}

const registerUser = async newUser => {
    await db.promise().query('INSERT INTO USERS SET ?', [newUser])
}

export {
    registerUser,
    getUserByUsername
}