import mongoose from 'mongoose'

const schema = mongoose.Schema(
	{
		members:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
	},
	{
		timestamps: true
	}
)

export default mongoose.model('Chat', schema)