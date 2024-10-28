class User {
    constructor(id, name,surname, email, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.surname= surname;
    }
}

module.exports = User;