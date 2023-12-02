### Modelo: User

- **Atributos:**

| Atributo        | Tipo de Dato | Requerido  | Opciones de Valor | Valor por Defecto |
| --------------- | ------------ | ---------- | ----------------- | ----------------- |
| \_id            | ObjectId     | Automático | -                 | -                 |
| \_\_t           | String       | Automático | -                 | -                 |
| username        | String       | Sí         | -                 | -                 |
| password        | String       | Sí         | -                 | -                 |
| email           | String       | Sí         | -                 | -                 |
| profile_picture | String       | No         | -                 | ""                |
| recovery_token  | String       | No         | -                 | ""                |

---

### Modelo: Admin (Hereda de User)

- **Atributos Adicionales:**

 | Atributo        | Tipo de Dato | Requerido | Opciones de Valor      | Valor por Defecto |
 | --------------- | ------------ | --------- | ---------------------- | ----------------- |
 | entity_name     | String       | Sí        | -                      | -                 |
 | deposit_address | String       | Sí        | -                      | -                 |
 | deposit_qr      | String       | No        | -                      | ""                |
 | available_days  | Number       | Sí        | -                      | 0                 |
 | account_state   | String       | Sí        | "activo", "suspendido" | "activo"          |

---

### Modelo: Client (Hereda de User)

- **Atributos Adicionales:**

 | Atributo      | Tipo de Dato | Requerido | Opciones de Valor                     | Valor por Defecto |
 | ------------- | ------------ | --------- | ------------------------------------- | ----------------- |
 | fullname      | String       | Sí        | -                                     | -                 |
 | country       | String       | Sí        | -                                     | -                 |
 | phone         | String       | Sí        | -                                     | -                 |
 | account_state | String       | Sí        | "en revision", "activo", "suspendido" | "en revision"     |
 | i_wallet      | ObjectId     | No        | -                                     | -                 |
 | usd_wallet    | ObjectId     | No        | -                                     | -                 |
 | admin         | ObjectId     | No        | -                                     | -                 |

---

### Modelo: Package

- **Atributos:**

| Atributo           | Tipo de Dato | Requerido  | Opciones de Valor | Valor por Defecto |
| ------------------ | ------------ | ---------- | ----------------- | ----------------- |
| \_id               | ObjectId     | Automático | -                 | -                 |
| name               | String       | Sí         | -                 | -                 |
| min_opening_amount | Number       | Sí         | -                 | -                 |
| global_amount      | Number       | Sí         | -                 | -                 |
| revenue_freq       | Number       | Sí         | -                 | -                 |
| revenue_percentage | Number       | Sí         | -                 | -                 |
| min_inv_days       | Number       | Sí         | -                 | -                 |
| admin              | ObjectId     | No         | -                 | -                 |

---

### Modelo: Wallet

- **Atributos:**

 | Atributo         | Tipo de Dato | Requerido  | Opciones de Valor   | Valor por Defecto |
 | ---------------- | ------------ | ---------- | ------------------- | ----------------- |
 | \_id             | ObjectId     | Automático | -                   | -                 |
 | type             | String       | Sí         | "USD", "Investment" | -                 |
 | name             | String       | Sí         | -                   | -                 |
 | password         | String       | Sí         | -                   | -                 |
 | available_amount | Number       | No         | -                   | 0                 |
 | client           | ObjectId     | No         | -                   | -                 |
 | admin            | ObjectId     | No         | -                   | -                 |

---

### Modelo: Movement

- **Atributos:**

| Atributo       | Tipo de Dato | Requerido  | Opciones de Valor                                                         | Valor por Defecto |
| -------------- | ------------ | ---------- | ------------------------------------------------------------------------- | ----------------- |
| \_id           | ObjectId     | Automático | -                                                                         | -                 |
| date           | Date         | Sí         | -                                                                         | Date.now          |
| movement_state | String       | Sí         | "pendiente", "aprobado", "rechazado", "remitido", "cancelado", "resuelto" | "pendiente"       |
| description    | String       | No         | -                                                                         | -                 |
| admin          | ObjectId     | No         | -                                                                         | -                 |
| client         | ObjectId     | No         | -                                                                         | -                 |

---

### Modelo: WalletTransaction (Hereda de Movement)

- **Atributos Adicionales:**

 | Atributo           | Tipo de Dato | Requerido | Opciones de Valor | Valor por Defecto |
 | ------------------ | ------------ | --------- | ----------------- | ----------------- |
 | transaction_amount | Number       | Sí        | -                 | -                 |
 | origin_wallet      | ObjectId     | Sí        | -                 | -                 |
 | dest_wallet        | ObjectId     | Sí        | -                 | -                 |
 | received_amount    | Number       | No        | -                 | 0                 |

---

### Modelo: SupportTicket (Hereda de Movement)

- **Atributos Adicionales:**

| Atributo | Tipo de Dato | Requerido | Opciones de Valor | Valor por Defecto |
| -------- | ------------ | --------- | ----------------- | ----------------- |
| category | String       | Sí        | -                 | -                 |

---

### Modelo: Investment

- **Atributos:**

 | Atributo          | Tipo de Dato | Requerido  | Opciones de Valor                                  | Valor por Defecto |
 | ----------------- | ------------ | ---------- | -------------------------------------------------- | ----------------- |
 | \_id              | ObjectId     | Automático | -                                                  | -                 |
 | start_date        | Date         | No         | -                                                  | Date.now          |
 | actual_start_date | Date         | No         | -                                                  | -                 |
 | end_date          | Date         | Sí         | -                                                  | -                 |
 | package           | ObjectId     | Sí         | -                                                  | -                 |
 | state             | String       | Sí         | "pendiente", "en curso", "rechazado", "finalizado" | "pendiente"       |
 | wallet            | ObjectId     | No         | -                                                  | -                 |
 | inv_amount        | Number       | No         | -                                                  | 0                 |
 | revenue           | Number       | No         | -                                                  | 0                 |

