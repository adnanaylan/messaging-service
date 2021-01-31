# Messaging Service
A messaging service case study.

## How to run?
Messaging Service requires [Node.js](https://nodejs.org/) to run. Before running the service, don't forget to add a .env file into project directory. Example .env file is configured for running with npm by default.

### NPM
For who wants to use it without docker. (for development purposes)
Install the dependencies and devDependencies and start the server.
```sh
$ cd messaging-service
$ cp .env.example .env
$ npm install
$ npm run dev
```

### Docker
By default, the Docker will expose port 4000 for the messaging-service, so change this within the Dockerfile if necessary. 
Don't forget to configure the MONGO_URI in .env file as "mongodb://messaging-service-mongo:27017/messaging-service". Then run,
```sh
$ docker-compose up -d
```

## Testing
```sh
$ npm test
```

### Coverage Report
```sh
$ npm run test:coverage
```

## Scalability
Server will scale in terms of the number of cpu cores on the machine. Used native Nodejs cluster module for imlementing that feature. See https://nodejs.org/api/cluster.html for more information.

## Logs
All the server logs will be saved in the messagin-service.log file.
Activity logs of the users can be found in both the messaging-service.log file and the database.

## End Points
See the Postman documentation: https://documenter.getpostman.com/view/14323100/TW6zFSW1