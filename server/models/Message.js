import mongoose from 'mongoose'

const schema = mongoose.Schema(
	{
		text: String,
		image: String,
		chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
		sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Message', schema)