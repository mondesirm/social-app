import mongoose from 'mongoose'

const schema = mongoose.Schema(
	{
		username: {
			type: String,
			default: 'user_' + Math.random().toString(36).substring(2, 15)
		},
		email: String,
		password: String,
		firstName: String,
		lastName: String,
		isOnline: { type: Boolean, default: false },
		token: { type: String, default: ''},
		roles: { type: Array, default: ['user'] },
		rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
		followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
	},
	{
		timestamps: true
	}
)

schema.virtual('fullName').get(() => { return this.firstName + ' ' + this.lastName })

export default mongoose.model('User', schema)