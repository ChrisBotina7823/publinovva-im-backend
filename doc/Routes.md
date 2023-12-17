## Resumen


| Ruta                                       | Tipo de Método | Descripción                                                                                                                            |
|--------------------------------------------|----------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `/auth/superuser`                           | `POST`         | Inicia sesión como superusuario. Retorna un token de acceso JWT en caso de éxito.                                                     |
| `/auth/client`                              | `POST`         | Inicia sesión como cliente. Retorna un token de acceso JWT en caso de éxito.                                                           |
| `/auth/admin`                               | `POST`         | Inicia sesión como administrador. Retorna un token de acceso JWT en caso de éxito.                                                      |
| `/auth/forgot-password/`                    | `POST`         | Envía un correo electrónico para la recuperación de contraseña.                                                                        |
| `/auth/reset-password/:token`               | `GET`          | Verifica un token de recuperación de contraseña. Retorna el token en caso de éxito.                                                     |
| `/auth/reset-password/:token`               | `POST`         | Cambia la contraseña con un token de recuperación. Retorna un mensaje indicando el cambio exitoso.                                      |
| `/users/`                                  | `GET`          | Obtiene todos los usuarios.                                                                                                           |
| `/users/:username`                          | `GET`          | Obtiene información de un usuario específico.                                                                                         |
| `/users/`                                  | `POST`         | Crea un nuevo usuario.                                                                                                                |
| `/users/:prevUsername`                      | `PUT`          | Actualiza información de un usuario.                                                                                                  |
| `/users/:username`                          | `DELETE`       | Elimina un usuario.                                                                                                                   |
| `/users/profile-picture/:username`          | `POST`         | Actualiza la imagen de perfil de un usuario.                                                                                         |
| `/users/movements/:username`                | `GET`          | Obtiene movimientos de un usuario.                                                                                                    |
| `/admins/`                                 | `GET`          | Obtiene todos los administradores.                                                                                                    |
| `/admins/clients/:username`                 | `GET`          | Obtiene clientes de un administrador específico.                                                                                     |
| `/admins/:username`                         | `GET`          | Obtiene información de un administrador específico.                                                                                  |
| `/admins/`                                 | `POST`         | Crea un nuevo administrador.                                                                                                          |
| `/admins/:username`                         | `PUT`          | Actualiza información de un administrador.                                                                                            |
| `/admins/account-state/:username`           | `PUT`          | Cambia el estado de cuenta de un administrador.                                                                                      |
| `/admins/deposit-qr/:username`              | `POST`         | Actualiza código QR de depósito de un administrador.                                                                                 |
| `/admins/:username`                         | `DELETE`       | Elimina un administrador.                                                                                                             |
| `/clients/`                                | `GET`          | Obtiene todos los clientes.                                                                                                           |
| `/clients/`                                | `POST`         | Crea un nuevo cliente.                                                                                                                |
| `/clients/:username`                        | `GET`          | Obtiene información de un cliente específico.                                                                                        |
| `/clients/:username`                        | `PUT`          | Actualiza información de un cliente.                                                                                                 |
| `/clients/:username`                        | `DELETE`       | Elimina un cliente.                                                                                                                   |
| `/wallets/`                                | `GET`          | Obtiene todas las wallets.                                                                                                            |
| `/wallets/:id`                             | `GET`          | Obtiene información de una wallet específica.                                                                                        |
| `/wallets/change-password/:id`             | `POST`         | Cambia la contraseña de una wallet.                                                                                                   |
| `/wallets/:username/:type`                 | `PUT`          | Actualiza información de una wallet.                                                                                                 |
| `/packages/`                               | `POST`         | Crea un nuevo paquete.                                                                                                                |
| `/packages/`                               | `GET`          | Obtiene todos los paquetes.                                                                                                          |
| `/packages/:id`                            | `GET`          | Obtiene un paquete por ID.                                                                                                           |
| `/packages/:id`                            | `PUT`          | Actualiza un paquete por ID.                                                                                                         |
| `/packages/:id`                            | `DELETE`       | Elimina un paquete por ID.                                                                                                           |
| `/movements/`                              | `GET`          | Obtiene todos los movimientos.                                                                                                       |
| `/movements/wallet-transactions/:username/:dest` | `POST`    | Realiza transacción entre billeteras.                                                                                                |
| `/movements/make-deposit/:username`        | `POST`         | Realiza depósito en la billetera.                                                                                                   |
| `/movements/make-withdrawal/:username`     | `POST`         | Realiza retiro de la billetera.                                                                                                      |
| `/movements/make-support-ticket/:username` | `POST`         | Crea ticket de soporte.                                                                                                              |
| `/investments/`                            | `GET`          | Obtiene todas las inversiones.                                                                                                       |
| `/investments/:username`                   | `POST`         | Inicia una nueva inversión para un cliente.                                                                                         |
| `/investments/change-state/:id`            | `POST`         | Cambia el estado de una inversión.                                                                                                   |
| `/investments/update/:id`                  | `POST`         | Actualiza información de una inversión.                                                                                             |

---
## Auth

### Iniciar sesión como superusuario

- **Ruta:** `/auth/superuser`
- **Método:** `POST`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene las credenciales del superusuario.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Token de acceso JWT para el superusuario.

---

### Iniciar sesión como cliente

- **Ruta:** `/auth/client`
- **Método:** `POST`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene las credenciales del cliente.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Token de acceso JWT para el cliente.

---

### Iniciar sesión como administrador

- **Ruta:** `/auth/admin`
- **Método:** `POST`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene las credenciales del administrador.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Token de acceso JWT para el administrador.

---

### Recuperación de contraseña - Enviar correo electrónico

- **Ruta:** `/auth/forgot-password/`
- **Método:** `POST`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene el nombre de usuario (`username`) del usuario para recuperar la contraseña.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON con un mensaje indicando que se envió un correo electrónico para la recuperación de contraseña.

---

### Recuperación de contraseña - Verificar token

- **Ruta:** `/auth/reset-password/:token`
- **Método:** `GET`
- **Parámetros:**
  - `token` (En la ruta): Token de recuperación de contraseña.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON con el token de recuperación de contraseña.

---

### Recuperación de contraseña - Cambiar contraseña

- **Ruta:** `/auth/reset-password/:token`
- **Método:** `POST`
- **Parámetros:**
  - `token` (En la ruta): Token de recuperación de contraseña.
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la nueva contraseña (`password`).
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON con un mensaje indicando que la contraseña se cambió exitosamente.

---

## Users


### Obtener todos los usuarios

- **Ruta:** `/users/`
- **Método:** `GET`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Lista de objetos JSON que representan a todos los usuarios.

---

### Obtener información de un usuario específico

- **Ruta:** `/users/:username`
- **Método:** `GET`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del usuario.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información del usuario especificado.

---

### Crear un nuevo usuario

- **Ruta:** `/users/`
- **Método:** `POST`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la información del nuevo usuario, incluyendo nombre de usuario (`username`), contraseña (`password`), y correo electrónico (`email`).
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información del nuevo usuario creado.

---

### Actualizar información de un usuario

- **Ruta:** `/users/:prevUsername`
- **Método:** `PUT`
- **Parámetros:**
  - `prevUsername` (En la ruta): Nombre de usuario del usuario a actualizar.
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la información actualizada del usuario.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información actualizada del usuario.

---

### Eliminar un usuario

- **Ruta:** `/users/:username`
- **Método:** `DELETE`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del usuario a eliminar.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON con un mensaje indicando que se eliminó exitosamente al usuario.

---

### Actualizar imagen de perfil de un usuario

- **Ruta:** `/users/profile-picture/:username`
- **Método:** `POST`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del usuario.
- **Cuerpo de la solicitud (Body):** Archivo de imagen (imagen de perfil) a subir.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información del usuario actualizado con la nueva imagen de perfil.

---

### Obtener movimientos de un usuario

- **Ruta:** `/users/movements/:username`
- **Método:** `GET`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del usuario.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Lista de objetos JSON que representan los movimientos asociados al usuario.

---

## Admins


### Obtener todos los administradores

- **Ruta:** `/admins/`
- **Método:** `GET`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Lista de objetos JSON que representan a los administradores.

---

### Obtener clientes de un administrador específico

- **Ruta:** `/admins/clients/:username`
- **Método:** `GET`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del administrador.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Lista de objetos JSON que representan a los clientes asociados al administrador.

---

### Obtener información de un administrador específico

- **Ruta:** `/admins/:username`
- **Método:** `GET`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del administrador.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información del administrador.

---

### Crear un nuevo administrador

- **Ruta:** `/admins/`
- **Método:** `POST`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Objeto JSON que representa la información del nuevo administrador.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información del nuevo administrador creado.

---

### Actualizar información de un administrador

- **Ruta:** `/admins/:username`
- **Método:** `PUT`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del administrador a actualizar.
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la información actualizada del administrador.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información actualizada del administrador.

---

### Cambiar estado de cuenta de un administrador

- **Ruta:** `/admins/account-state/:username`
- **Método:** `PUT`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del administrador.
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene el nuevo estado de cuenta (`account_state`).
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON con un mensaje indicando el cambio de estado de cuenta.

---

### Actualizar código QR de depósito de un administrador

- **Ruta:** `/admins/deposit-qr/:username`
- **Método:** `POST`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del administrador.
- **Cuerpo de la solicitud (Body):** Archivo de imagen (código QR) a subir.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información del administrador actualizado con el código QR de depósito.

---

### Eliminar un administrador

- **Ruta:** `/admins/:username`
- **Método:** `DELETE`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del administrador a eliminar.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON con un mensaje indicando la eliminación exitosa del administrador.

---

## Clients

### Obtener todos los clientes

- **Ruta:** `/clients/`
- **Método:** `GET`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Lista de objetos JSON que representan a todos los clientes.

---

### Crear un nuevo cliente

- **Ruta:** `/clients/`
- **Método:** `POST`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la información del nuevo cliente, incluyendo detalles de la billetera USD e inversión.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información del nuevo cliente creado.

---

### Obtener información de un cliente específico

- **Ruta:** `/clients/:username`
- **Método:** `GET`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del cliente.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información del cliente especificado.

---

### Actualizar información de un cliente

- **Ruta:** `/clients/:username`
- **Método:** `PUT`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del cliente a actualizar.
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la información actualizada del cliente.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información actualizada del cliente.

---

### Eliminar un cliente

- **Ruta:** `/clients/:username`
- **Método:** `DELETE`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del cliente a eliminar.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON con un mensaje indicando que se eliminó exitosamente al cliente.

---

## Wallets

### Obtener todas las wallets

- **Ruta:** `/wallets/`
- **Método:** `GET`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Lista de objetos JSON que representan todas las wallets.

---

### Obtener información de una wallet específica

- **Ruta:** `/wallets/:id`
- **Método:** `GET`
- **Parámetros:**
  - `id` (En la ruta): ID de la wallet.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información de la wallet especificada.

---

### Cambiar la contraseña de una wallet

- **Ruta:** `/wallets/change-password/:id`
- **Método:** `POST`
- **Parámetros:**
  - `id` (En la ruta): ID de la wallet.
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la nueva contraseña (`password`) de la wallet.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la wallet actualizada con la nueva contraseña.

---

### Actualizar información de una wallet

- **Ruta:** `/wallets/:username/:type`
- **Método:** `PUT`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario asociado con la wallet.
  - `type` (En la ruta): Tipo de wallet (`USD` o `Investment`).
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la información actualizada de la wallet.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la wallet actualizada con la nueva información.

---

## Packages

### Crear un nuevo paquete

- **Ruta:** `/packages/`
- **Método:** `POST`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la información del nuevo paquete, incluyendo el administrador asignado (`admin_username`).
- **Salida exitosa:**
  - Código de estado: `201 Created`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa el nuevo paquete creado.

---

### Obtener todos los paquetes

- **Ruta:** `/packages/`
- **Método:** `GET`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Lista de objetos JSON que representan todos los paquetes.

---

### Obtener un paquete por ID

- **Ruta:** `/packages/:id`
- **Método:** `GET`
- **Parámetros:**
  - `id` (En la ruta): ID del paquete.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la información del paquete especificado.

---

### Actualizar un paquete por ID

- **Ruta:** `/packages/:id`
- **Método:** `PUT`
- **Parámetros:**
  - `id` (En la ruta): ID del paquete a actualizar.
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la información actualizada del paquete, incluyendo el administrador asignado (`admin_username`).
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa el paquete actualizado.

---

### Eliminar un paquete por ID

- **Ruta:** `/packages/:id`
- **Método:** `DELETE`
- **Parámetros:**
  - `id` (En la ruta): ID del paquete a eliminar.
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON con un mensaje indicando que el paquete fue eliminado exitosamente.

---

## Movements

### Obtener todos los movimientos

- **Ruta:** `/movements/`
- **Método:** `GET`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Lista de objetos JSON que representan todos los movimientos.

---

### Realizar transacción entre billeteras

- **Ruta:** `/movements/wallet-transactions/:username/:dest`
- **Método:** `POST`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del cliente.
  - `dest` (En la ruta): Destino de la transacción (`usd` para transferencias en dólares, `inv` para transferencias de inversión).
- **Cuerpo de la solicitud (Body):**
  - `transaction_amount`: Monto de la transacción.
  - `wallet_password`: Contraseña de la billetera.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa el movimiento de la transacción.

---

### Realizar depósito en la billetera

- **Ruta:** `/movements/make-deposit/:username`
- **Método:** `POST`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del cliente.
- **Cuerpo de la solicitud (Body):**
  - `transaction_amount`: Monto del depósito.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa el movimiento del depósito.

---

### Realizar retiro de la billetera

- **Ruta:** `/movements/make-withdrawal/:username`
- **Método:** `POST`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del cliente.
- **Cuerpo de la solicitud (Body):**
  - `transaction_amount`: Monto del retiro.
  - `wallet_password`: Contraseña de la billetera.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa el movimiento del retiro.

---

### Crear ticket de soporte

- **Ruta:** `/movements/make-support-ticket/:username`
- **Método:** `POST`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del cliente.
- **Cuerpo de la solicitud (Body):**
  - `description`: Descripción del problema.
  - `category`: Categoría del ticket de soporte.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa el movimiento del ticket de soporte.

---

## Investments

### Obtener todas las inversiones

- **Ruta:** `/investments/`
- **Método:** `GET`
- **Parámetros:** Ninguno
- **Cuerpo de la solicitud (Body):** Ninguno
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Lista de objetos JSON que representan todas las inversiones.

---

### Iniciar una nueva inversión para un cliente

- **Ruta:** `/investments/:username`
- **Método:** `POST`
- **Parámetros:**
  - `username` (En la ruta): Nombre de usuario del cliente.
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la información necesaria para comenzar una nueva inversión, incluyendo la fecha de finalización (`end_date`), el ID del paquete (`package_id`), y el monto de inversión (`inv_amount`).
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la nueva inversión iniciada.

---

### Cambiar el estado de una inversión

- **Ruta:** `/investments/change-state/:id`
- **Método:** `POST`
- **Parámetros:**
  - `id` (En la ruta): ID de la inversión a actualizar.
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene el nuevo estado (`state`) de la inversión.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la inversión actualizada con el nuevo estado.

---

### Actualizar información de una inversión

- **Ruta:** `/investments/update/:id`
- **Método:** `POST`
- **Parámetros:**
  - `id` (En la ruta): ID de la inversión a actualizar.
- **Cuerpo de la solicitud (Body):** Objeto JSON que contiene la información actualizada de la inversión.
- **Salida exitosa:**
  - Código de estado: `200 OK`
  - Tipo de contenido: `application/json`
  - Cuerpo de respuesta: Objeto JSON que representa la inversión actualizada con la nueva información.
