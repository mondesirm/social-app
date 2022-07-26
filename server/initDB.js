#! /usr/bin/env node

import async from 'async';
import mongoose from 'mongoose';

import User from './models/userModel.js';
import Tech from './models/techModel.js';

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
	console.error('You need to specify a valid mongodb URL as the first argument');
	console.log('Usage: node initDB.js mongodb+srv://<user>:<password>@<host>/<database>?retryWrites=true');
	userArgs[0] = process.env.MONGODB_CONNECTION;
}

var mongoDB = userArgs[0];
// var mongoDB = process.env.MONGODB_CONNECTION;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
var techs = [];

function userCreate(username, password, firstname, lastname, isAdmin, followers, following, techs, cb) {
	const user = new User({
		username: username,
		password: password,
		firstname: firstname,
		lastname: lastname,
		isAdmin: isAdmin,
		followers: followers,
		following: following,
		techs: techs,
	});

	user.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}

		console.log('\n' + user.username + ':' + user._id);
		users.push(user);
		cb(null, user);
	});
}

function techCreate(name, cb) {
	const tech = new Tech({
		name: name
	});

	tech.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}

		techs.push(tech);
		cb(null, tech);
	});
}

function createUsers(cb) {
	async.series([
		function (callback) {
			userCreate('john.doe', '$2b$10$mqv/8wKw5Kou4WdiNWCD8.BcRZgtfbGA92IFzRdw4dn5gpJPqos4K', 'John', 'DOE', true, [], users.map(user => user._id), techs, callback);
		},
		function (callback) {
			userCreate('anonymous', '$2b$10$mqv/8wKw5Kou4WdiNWCD8.BcRZgtfbGA92IFzRdw4dn5gpJPqos4K', 'Ann Onnie', 'Moss', false, [], [], [techs[0]._id], callback);
		},
		function (callback) {
			userCreate('jane.doe', '$2b$10$mqv/8wKw5Kou4WdiNWCD8.BcRZgtfbGA92IFzRdw4dn5gpJPqos4K', 'Jane', 'DOE', false, [users[1]._id], [], [techs[1]._id], callback);
		}
	], cb);
}

function createTechs(cb) {
	async.series([
		function (callback) {
			techCreate('JS', callback);
		},
		function (callback) {
			techCreate('PHP', callback);
		}
	], cb);
}

async.series([createTechs, createUsers], function (err, results) {
	if (err) console.log('\nFinal error: ' + err);
	else {
		console.log('\n' + users.length + ' user(s)');
		console.log(techs.length + ' tech(s)');
	}

	mongoose.connection.close();
});