DROP TABLE clients;
DROP TABLE admins;
DROP TABLE users;

CREATE TABLE users (
    username VARCHAR(127) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(127) NOT NULL,
    profile_picture VARCHAR(255) NOT NULL DEFAULT 'https://blog.alliedmarketresearch.com/images/user_icon.png',
    PRIMARY KEY (username)
);

CREATE TABLE admins (
    username VARCHAR(127) NOT NULL,
    entity_name VARCHAR(127) NOT NULL,
    deposit_address VARCHAR(255) NOT NULL,
    deposit_qr VARCHAR(255),
    available_days INTEGER NOT NULL DEFAULT 0,
    account_state VARCHAR(127) NOT NULL DEFAULT 'activo',
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE clients (
    username VARCHAR(127) NOT NULL,
    fullname VARCHAR(127) NOT NULL,
    country VARCHAR(127) NOT NULL,
    phone VARCHAR(127) NOT NULL,
    account_state VARCHAR(127) NOT NULL DEFAULT 'en revision',
    admin_username VARCHAR(127) NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (admin_username) REFERENCES admins(username) ON DELETE CASCADE
);
