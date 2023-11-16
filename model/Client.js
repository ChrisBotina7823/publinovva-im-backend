// This only contains the extra attributes for the client user
class Client {
    constructor(username, fullname, country, phone, admin_username) {
        this.username = username
        this.fullname = fullname
        this.country = country
        this.phone = phone
        this.admin_username = admin_username
    }
}

export default Client