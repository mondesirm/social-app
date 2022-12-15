import Sequelize from "sequelize"

const connection = new Sequelize(process.env.DB_CONN, { useNewUrlParser: true })
  .authenticate()
  .then(() => { console.log('Connection has been established successfully.') })
  .catch((err) => { console.error('Unable to connect to the database:', err) })

export default connection
export const User = require('./User').default
export const Post = require('./Post').default

User.hasMany(Post)
Post.belongsTo(User)

const denormalizePost = post => Post.findByPk(post.id, { include: [{
	model: User,
	as: 'author',
	attributes: ['id', 'firstName']
}]}).then(res => PostMongo.findOneAndUpdate(
	{ _id: post.id },
	{ $set: res.dataValues },
	{ upsert: true }
))
	
User.addHook('afterUpdate', user => Post.findAll({ include: [{
	model: User,
	as: 'author',
	where: { id: user.id },
}]}).then(posts => posts.forEach(post => denormalizePost(post))))

Post.addHook('afterCreate', denormalizePost)
Post.addHook('afterUpdate', denormalizePost)
Post.addHook('afterDestroy', post => PostMongo.deleteOne({ _id: post.id }))