import mongoose from 'mongoose';
import Logger from '../core/Logger';
import { db, dbUrl } from '../config';
import Role, { RoleCode } from './models/Role';

// Build the connection string
const dbURI = dbUrl ?? `mongodb://${db.user}:${encodeURIComponent(db.password)}@${db.host}:${db.port}/${
  db.name
}`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

Logger.debug(dbURI);

// Create the database connection
mongoose
  .connect(dbURI, options)
  .then(async () => {
    const initUser = await Role.findOne({ code: RoleCode.ADMIN });
		if(!initUser) {
			Role.insertMany([
        { code: 'ADMIN', status: true },
        { code: 'USER', status: true },
      ])
		}
    
    Logger.info('Mongoose connection done');
  })
  .catch((e) => {
    Logger.info('Mongoose connection error');
    Logger.error(e);
  });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  Logger.info('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  Logger.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  Logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    Logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
