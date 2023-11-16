// This only contains the extra attributes for the admin user

class Admin {
    constructor(username, entity_name, deposit_address, deposit_qr) {
        this.username = username
        this.entity_name = entity_name
        this.deposit_address = deposit_address
        this.deposit_qr = deposit_qr
    }
}

export default Admin