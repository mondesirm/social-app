import mongoose from 'mongoose'

const schema = mongoose.Schema(
	{
		name: String,
		description: { type: String, default: '' },
		link: { type: String, default: '' },
		logo: { type: String, default: 'default.png' },
		banner: { type: String, default: 'default.png' },
		rooms:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: [] }]
	},
	{
		timestamps: true
	}
)

export default mongoose.model('Brand', schema)