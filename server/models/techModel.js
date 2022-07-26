import mongoose from 'mongoose';

const TechSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

const TechModel = mongoose.model('Techs', TechSchema);

export default TechModel;