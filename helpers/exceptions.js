const invalidPassword = (username) => {
    throw new Error(`La contraseña proporcionada para el usuario ${username} es incorrecta`)
}

const userNotFound = (username) => {
    throw new Error(`El usuario ${username} no está registrado en el sistema`)
}

export {
    invalidPassword,
    userNotFound
}