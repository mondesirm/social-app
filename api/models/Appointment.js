import mongoose from 'mongoose'

const schema = mongoose.Schema(
	{
		date: { type: Date },
		data: { type: String },
		customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
	},
	{
		timestamps: true
	}
)

export default mongoose.model('Meeting', schema)