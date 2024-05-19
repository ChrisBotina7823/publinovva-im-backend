const invalidPassword = (username) => {
    throw new Error(`La contraseña proporcionada para el usuario ${username} es incorrecta`)
}

const userNotFound = (username) => {
    throw new Error(`El usuario ${username} no está registrado en el sistema`)
}

const suspendedUser = (username) => {
    throw new Error(`La cuenta ${username} aún no ha sido activada o fue suspendida, contáctate con el administrador.`)
}

export {
    invalidPassword,
    userNotFound,
    suspendedUser
}