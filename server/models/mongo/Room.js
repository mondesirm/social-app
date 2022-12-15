import mongoose from 'mongoose'

const schema = mongoose.Schema(
	{
		name: String,
		owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		admins:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		members:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
	},
	{
		timestamps: true
	}
)

export default mongoose.model('Room', schema)