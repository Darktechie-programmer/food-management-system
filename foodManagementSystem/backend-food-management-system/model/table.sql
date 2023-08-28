CREATE TABLE fms_user{
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(100),
    password varchar(50),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
}

INSERT INTO public.fms_user(
	name, "contactNumber", email, password, status, role)
	VALUES ('Admin', '123456789', 'admin@gamil.com', 'admin', 'true', 'admin');

SELECT id, name, "contactNumber", email, password, status, role
	FROM public.fms_user;

CREATE TABLE fms_category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    primary key(id)
)

CREATE TABLE fms_product(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    categoryId integer NOT NULL, 
    description varchar(255),
    price integer,
    status varchar(20),
    primary key (id)
)

CREATE TABLE fms_bill(
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(100) NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    contactNumber varchar(255) NOT NULL,
    paymentMethod varchar(255) NOT NULL,
    total int NOT NULL,
    productDetails JSON DEFAULT NULL,
    primary key (id)
)