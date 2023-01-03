import mongoose from 'mongoose'

const schema = mongoose.Schema(
	{
		name: String,
		description: { type: String, default: '' },
		limits: { type: Number, default: 10 },
		isPrivate: { type: Boolean, default: false },
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
		brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', default: null }
	},
	{
		timestamps: true
	}
)

export default mongoose.model('Room', schema)