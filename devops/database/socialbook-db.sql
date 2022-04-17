create schema sb;

create table sb.user(
    id_user serial primary key, 
    id_library integer,
    name text, 
    email text, 
    bio text, 
    profilePic text, 
    registerDate timestamp,  
    deactiveDate timestamp, 
    lastLogin timestamp
)


insert into sb.user (id_library,name, email,bio,profilePic,registerDate,deactiveDate,lastLogin) values (1,'John Lennon', 'blackbirdflies.com.uk','singer and guitar player','', now(),null,null);