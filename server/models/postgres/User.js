import { Model, DataTypes } from 'sequelize'
import connection from './index'
import { hash, genSalt } from 'bcryptjs'

class User extends Model {}

User.init(
	{
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		roles: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: false,
			defaultValue: ['user']
		}
	},
	{
		sequelize: connection,
		modelName: 'user',
		paranoid: true
	}
)

User.addHook('beforeCreate', async user => {
	user.password = await hash(user.password, await genSalt())
})

User.addHook('beforeUpdate', async (user, { fields }) => {
	if (fields.includes('password')) {
		user.password = await hash(user.password, await genSalt())
	}
})

export default User