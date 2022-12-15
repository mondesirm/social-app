import { Model, DataTypes } from 'sequelize'
import connection from './db'

class Post extends Model {}

Post.init({
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [3],
			},
		},
	},
	{
		sequelize: connection,
		modelName: 'post',
		paranoid: true,
	}
)

export default Post