import User from './User.js'

class Client extends User {
    constructor(username, password, email, profile_picture, fullname, country, phone) {
        super(username, password, email, profile_picture)
        this.fullname = fullname
        this.country = country
        this.phone = phone
    }
}

export default Client