# Models

### User

| attribute       | type    | extra          |
| --------------- | ------- | -------------- |
| username        | String  | PK, NN         |
| password        | String  | NN             |
| email           | String  | NN             |
| profile_picture | String  |                |

#### User <- Admin

| attribute       | type    | extra                                            |
| --------------- | ------- | ------------------------------------------------ |
| entity_name     | String  | NN                                               |
| deposit_address | String  | NN                                               |
| deposit_qr      | String  | DF=""                                                 | 
| available_days  | Integer | NN, DF=0, AUTO SCH                               |
| account_state   | String  | NN, DF="activo", values:{"activo", "suspendido"} |

#### User <- Client

| attribute     | type    | extra                                                                |     |
| ------------- | ------- | -------------------------------------------------------------------- | --- |
| fullname      | String  | NN                                                                   |     |
| country       | String  | NN                                                                   |     |
| phone         | String  | NN                                                                   |     |
| account_state | String  | NN, DF:"en revision", values:{"en revisión", "activo", "suspendido"} |     |
| admin_id      | Integer | FK                                                                   |     | 

### Package

| attribute          | type    | extra        |
| ------------------ | ------- | ------------ |
| id                 | Integer | NN, PK, AUTO |
| name               | String  | NN           |
| min_opening_amount | Decimal | NN           |
| global_amount      | Decimal | NN           |
| revenue_freq       | Decimal | NN           |
| revenue_percentage | Decimal | NN           |
| admin_id           | String  | NN, FK       |

### Wallet

| attribute        | type    | extra                              |
| ---------------- | ------- | ---------------------------------- |
| id               | Integer | NN, PK, AUTO                       |
| type             | String  | NN, values: {"USD", "Inversiones"} |
| address          | String  | NN                                 |
| password         | String  | NN                                 |
| available_amount | Decimal | NN                                 | 

#### Wallet <- Investment Wallet

| attribute         | type    | extra    |
| ----------------- | ------- | -------- |
| investment_amount | Decimal | NN, DF=0 | 

### Movement

| attribute      | type    | extra                                                                                                  |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| id             | Integer | NN, PK, AUTO                                                                                           |
| date           | Date    | NN, DF=curr_date                                                                                       |
| client_id      | String  | NN, FK                                                                                                 |
| movement_state | String  | NN, DF="Pendiente", values:{"pendiente", "aprobado", "rechazado", "remitido", "cancelado", "resuelto"} | 
| description    | String  |                                                                                                        |

#### Movement <- Wallet Transaction

| attribute          | type    | extra    |
| ------------------ | ------- | -------- |
| transaction_amount | Decimal | NN       |
| origin_wallet      | Integer | NN, FK   |
| dest_wallet        | Integer | NN, FK   |
| recieved_amount    | Decimal | NN, DF=0 | 

### Investment

| attribute  | type    | extra                                                           |
| ---------- | ------- | --------------------------------------------------------------- |
| id         | Integer | NN, PK, AUTO                                                    |
| start_date | Date    | NN, DF=curr_date                                                |
| wallet_id  | Integer | NN, FK                                                          |
| package_id | Integer | NN, FK                                                          |
| day_count  | Integer | NN, DF=0, AUTO SCH                                              |
| revenue    | Integer | NN, DF=0, AUTO SCH                                              |
| end_date   | Date    | NN                                                              |
| state      | String  | NN, values:{"pendiente", "en curso", "rechazado", "finalizado"} | 

### Movement <- Support Ticket

| attribute       | type   | extra |
| --------------- | ------ | ----- |
| category        | String | NN    |
| email_title     | String | NN    |
| description_msg | String | NN    |

# Routes

## Auth

| route            | auth | method | description       |
| ---------------- | ---- | ------ | ----------------- |
| /auth/superuser/ | none | POST   | superuser sign in |
| /auth/admin/     | none | POST   | admin sign in     |
| /auth/customer/  | none | POST   | customer sign in  | 

### Users

| route             | auth      | method | description                    |
| ----------------- | --------- | ------ | ------------------------------ |
| /users/:id        | depending | PUT    | edit user base profile     |
| /users/           | superuser | POST   | add a new superuser            |
| /profile          | depending | GET    | get user's profile information |
| /profile/password | depending | PUT    | change user's password         |
| /profile/photo    | depending | PUT    | change user's profile picture  |

## Customers

| route                  | auth     | method | description                                      |
| ---------------------- | -------- | ------ | ------------------------------------------------ |
| /customers/            | admin    | POST   | add a new customer                               |
| /customers/:id         | customer | GET    | get a customer by id                             |
| /customers/:id         | admin    | PUT    | edit customer information                        | 
| /customers/profile/:id | customer | PUT    | edit customer profile (fullname, country, phone) |

## Admins

| route               | auth      | method | description                         |
| ------------------- | --------- | ------ | ----------------------------------- |
| /admins/            | superuser | POST   | add a new admin                     |
| /admins/            | superuser | GET    | get all admins                      |
| /admins/:id         | admin     | GET    | get admin by id                     |
| /admins/:id         | superuser | PUT    | edit admin information              |
| /admins/profile/:id | admin     | PUT    | edit admin profile (address and qr) | 

### Packages

| route         | auth  | method | description          |
| ------------- | ----- | ------ | -------------------- |
| /packages/    | admin | POST   | add a package        |
| /packages/    | admin | GET    | get all packages     |
| /packages/:id | admin | GET    | get package by id    |
| /packages/:id | admin | DELETE | delete package by id |
| /packages/:id | admin | PUT    | edit package by id   | 

## Wallet

| route        | auth     | method | description             |
| ------------ | -------- | ------ | ----------------------- |
| /wallets/    | admin    | POST   | add a new wallet        |
| /wallets/    | admin    | GET    | get all wallets         |
| /wallets/:id | customer | GET    | get a wallet by id      |
| /wallets/:id | admin    | DELETE | delete a wallet         |
| /wallets/:id | admin    | PUT    | edit wallet information | 

## Movements

| route                 | auth     | method | description     |
| --------------------- | -------- | ------ | --------------- |
| /movements/cancel/:id | customer | PUT    | cancel movement |

### Deposits

| route                   | auth     | method | description                |
| ----------------------- | -------- | ------ | -------------------------- |
| /movements/deposits/    | customer | POST   | initiate a deposit request |
| /movements/deposits/    | admin    | GET    | get all deposit requests   |
| /movements/deposits/:id | admin    | GET    | get deposit request by id  |
| /movements/deposits/:id | admin    | PUT    | edit deposit details       | 

### Withdrawals

| route                      | auth     | method | description                   |
| -------------------------- | -------- | ------ | ----------------------------- |
| /movements/withdrawals/    | customer | POST   | initiate a withdrawal request |
| /movements/withdrawals/    | admin    | GET    | get all withdrawal requests   |
| /movements/withdrawals/:id | admin    | GET    | get withdrawal request by id  |
| /movements/withdrawals/:id | admin    | PUT    | edit withdrawal details       | 

### Transfers

| route                    | auth     | method | description                       |
| ------------------------ | -------- | ------ | --------------------------------- |
| /movements/transfers/    | customer | POST   | initiate a transfer request       |
| /movements/transfers/    | admin    | GET    | get all transfer requests         |
| /movements/transfers/:id | admin    | GET    | get transfer request by id        |
| /movements/transfers/:id | admin    | PUT    | approve/reject a transfer request |
| /movements/transfers/:id | admin    | PUT    | manually edit transfer details    |

### Investments

| route                         | auth     | method | description                          |
| ----------------------------- | -------- | ------ | ------------------------------------ |
| /investments/                 | customer | POST   | initiate an investment request       |
| /investments/                 | admin    | GET    | get all investment requests          |
| /investments/:id              | customer | GET    | get investment request by id         |
| /investments/:id              | admin    | PUT    | approve/reject an investment request |

### Support Tickets

| route                          | auth     | method | description                              |
| ------------------------------ | -------- | ------ | ---------------------------------------- |
| /support-tickets/             | customer | POST   | submit a support ticket                 |
| /support-tickets/             | admin    | GET    | get all support tickets                 |
| /support-tickets/:id          | admin    | GET    | get support ticket by id                |

# Notes

- Autogenerated id for clients is unnecessary since the username field for general users act as a primary key.
- Wallet name and address when making a deposit is redundant since the client only has 2 wallets, it is simpler to have a selector.
- The QR code and admin account address should be displayed only once in a corner, not in all the registers.
- Asking for passwords in an emergent window is unnecessary and could affect the compatibility.
- There is a problem with the date validation, there is a case when initially the investment period is accepted (it matches the package condition), but the admin does not approve it early so when it starts to count it does not meet the package requirements.
- Is the revenue fixed or compound? the interest rate is applied to the initial amount or the current?
- do the categories have fixed values?
- In the end, the user can edit all the profile information, right?