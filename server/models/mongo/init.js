#! /usr/bin/env node

import async from 'async'
import mongoose from 'mongoose'
import readline from 'readline'

import User from './User.js'
import Chat from './Chat.js'
import Room from './Room.js'

// Get arguments and initialize variables
const args = process.argv.slice(2)
const dropped = []
const collections = ['users', 'chats', 'rooms']
const password = '$2b$10$mqv/8wKw5Kou4WdiNWCD8.BcRZgtfbGA92IFzRdw4dn5gpJPqos4K'
var seed = false
var mongoURL = process.env.DB_CONN

args.forEach(arg => {
	// If -h or --help is passed as argument then print help
	if (arg == '-h' || arg == '--help' || arg == 'help') {
		console.log('Usage: node init.js [<arg>] [...options]')
		// Subcommands
		console.log('\nArguments:')
		console.log('help				Show this help message')
		console.log('<URL>				MongoDB connection URL')
		console.log('\nExamples:')
		console.log('node init.js help')
		console.log('node init.js mongodb[+srv]://<user>:<pass>@<host>[/<db>]')
		console.log('node init.js -i coll2,coll3 -d')
		console.log('\nOptions:')
		console.log('[-h | --help]			Show this help message')
		console.log('[-o | --only] <collections>	Only load the specified comma-separated collections')
		console.log('[-i | --ignore] <collections>	Ignore the specified comma-separated collections')
		console.log('[-d | --drop] [<collections>]	Drop all or the specified comma-separated before loading')
		// if -o is passed with -i then ignore -i
		console.log('\nNote: -i is ignored if -o is passed')
		process.exit()
	}

	// If a mongodb URL is passed as argument then use it
	if (arg.startsWith('url=')) {
		mongoURL = arg.split('=')[1]

		// Regex to check if the URL scheme is valid
		const regex = /^mongodb(?:\+srv)?:\/\//

		if (!regex.test(mongoURL)) {
			console.error('Your URL should start with `mongodb://` or `mongodb+srv://`.')
			console.log('Your default URL is: ' + process.env.DB_CONN)

			const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

			// Ask user if they want to use the default URL
			rl.question('Do you want to use it? (y/n)', answer => {
				if (answer != 'y') process.exit(1)
				rl.close()
			})

			// Fallback to the default URL
			console.log(`Fallback to the default URL...`)
			mongoURL = process.env.DB_CONN
		}
	}

	// If specified, drop the collections before loading
	if (arg.startsWith('drop')) {
		const drop = arg.split('=')[1]?.split(',')
		console.log(`Dropping collections: ${drop?.join(', ') || 'all'}`)
		if (drop) drop.forEach(coll => { if (collections.includes(coll)) dropped.push(coll) })
		else dropped.push(...collections)
	}

	// If specified, load only the specified collections
	if (arg.startsWith('only=')) {
		const colls = arg.split('=')[1].split(',')
		console.log(`Only loading collections: ${colls.join(', ')}`)
		collections.forEach((coll, i) => { if (!colls.includes(coll)) delete collections[i] })
	}

	// If specified and args has no only argument, ignore the specified collections 
	if (arg.startsWith('ignore=') && args.some(arg => arg.startsWith('only='))) {
		const colls = arg.split('=')[1].split(',')
		console.log(`Ignoring collections: ${colls.join(', ')}`)
		collections.forEach((coll, i) => { if (colls.includes(coll)) delete collections[i] })
	}

	// Seed the database
	if (arg == '-s' || arg == '--seed' || arg == 'seed') {
		console.log('Seeding database...')
		seed = true
	}
})

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise

const { connection } = mongoose

connection.on('error', () => {
	console.error('Error connecting to MongoDB.')
	process.exit(1)
})

connection.once('open', () => {
	if (dropped.length) {
		dropped.forEach(collection => {
			connection.db.dropCollection(collection, err => {
				console.log(`Collection ${collection} ${err ? 'does not exist' : 'dropped'}.`)
			})
		})
	}
})

const Fixtures = (collections, callback = () => {}, seed = false) => {
	const data = {
		users: [],
		chats: [],
		rooms: []
	}

	const user = (username, email, password, firstName, lastName, isOnline, token, roles, rooms, followers, following, cb) => {
		const user = new User({
			username: username,
			email: email,	
			password: password,
			firstName: firstName,
			lastName: lastName,
			isOnline: isOnline,
			token: token,
			roles: roles,
			rooms: rooms,
			followers: followers,
			following: following
		})
	
		user.save(function (err) {
			if (err) {
				cb(err, null)
				return
			}
	
			console.log('\n' + user.username + ':' + user._id)
			data.users.push(user)
			cb(null, user)
		})
	}

	const chat = (members, cb) => {
		const chat = new Chat({
			members: members
		})
	
		chat.save(function (err) {
			if (err) {
				cb(err, null)
				return
			}
	
			data.chats.push(chat)
			cb(null, chat)
		})
	}

	const room = (name, owner, admins, members, cb) => {
		const room = new Room({
			name: name,
			owner: owner,
			admins: admins,
			members: members
		})
	
		room.save(function (err) {
			if (err) {
				cb(err, null)
				return
			}

			// For each member, add the room to their rooms array
			room.members.forEach(member => {
				member.rooms.push(room)
				member.updateOne({ rooms: member.rooms }, err => { if (err) console.log(err.message) })
			})
	
			data.rooms.push(room)
			cb(null, room)
		})
	}

	const users = cb => {
		async.series([
			callback => user('root1', 'root1@root.com', password, 'Root', '1', false, '', ['admin'], [], [], [], callback),
			callback => user('root2', 'root2@root.com', password, 'Root', '2', false, '', ['admin'], [], [], [], callback),
			callback => user('root3', 'root3@root.com', password, 'Root', '3', false, '', ['user'], [], [], data.users, callback)
		], cb)
	}

	const chats = cb => {
		async.series([
			callback => chat([data.users[0], data.users[1]], callback),
			callback => chat([data.users[0], data.users[2]], callback),
			callback => chat([data.users[1], data.users[2]], callback)
		], cb)
	}

	const rooms = cb => {
		async.series([
			callback => room('Help', data.users[0], data.users.slice(0, -1), data.users, callback),
			callback => room('Main', data.users[0], data.users.slice(0, -1), data.users, callback)
		], cb)
	}

	const load = (seeders, callback = () => {}, seed = false) => {
		if (seed) {
			async.series(seeders, err => {
				if (err) console.log('\nError loading fixtures: ' + err)
				else {
					console.log('\n' + data.users.length + ' users')
					console.log(data.chats.length + ' chats')
					console.log(data.rooms.length + ' rooms')
				}
			})
		}

		setTimeout(callback, 2000)
	}

	const functions = {
		users: users,
		chats: chats,
		rooms: rooms
	}

	const seeders = collections.map(i => functions[i]).filter(i => i)

	load(seeders, callback, seed)
}

Fixtures(collections, () => connection.close(), seed)