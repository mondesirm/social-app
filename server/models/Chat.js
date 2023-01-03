import mongoose from 'mongoose'

const schema = mongoose.Schema(
	{
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: [] }],
		images: [{ type: String, default: [] }],
	},
	{
		timestamps: true
	}
)

export default mongoose.model('Chat', schema)