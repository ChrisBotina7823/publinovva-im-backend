import User from './User.js'

class Admin extends User {
    constructor(username, password, email, profile_picture, entity_name, deposit_address, deposit_qr) {
        super(username, password, email, profile_picture)
        this.entity_name = entity_name
        this.deposit_address = deposit_address
        this.deposit_qr = deposit_qr
    }
}

export default Admin