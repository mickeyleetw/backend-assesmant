# backend-assessment
backend-assessment


## Installation for backend-assessment

1. Clone backend-assessment repository

   ```shell
   $ git clone https://github.com/mickeyleetw/backend-assesmant.git
   ```

2. Install project dependencies

   ```shell
   $ npm install
   ```

3. Setup for database

   this assessment needs a database. Run the following command to start a postgres database on `port=5432` (without any built-in data)

   ```shell
   $ docker-compose -f docker-compose.db.yaml up -d

   # reset or init db schema
   $ tsc && node dist/cli.js
   ```

4. Run service

   ```shell
   # normal mode
   $ tsc && node dist/app.js
   ```

   the above commands will boot microservice template service on `http://localhosl:3000`
   The default response in http://localhosl:3000/health-ckeck path will return the following JSON response

   ```json
   {
   "message": "Hello World"
   }
   ```

5. Run service on docker
   ```shell
   $ docker-compose -f docker-compose.all.yaml up -d
