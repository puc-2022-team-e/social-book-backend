#build project 

1- Subir o banco de dados e o pdAdmin 
   1.1 - Abrir o terminal 
   1.2 - Entrar via terminal na pasta devops/database/postgres
   1.3 - Executar o comando docker-compose up -d

2- Para acessar o pgadmin 
   2.1 - http://localhost:16543/browser/
   2.2 - Abrir a instancia da base de dados 
         server: database-postgres
         user: admin
         password:puc@2022
         database:socialbook-db