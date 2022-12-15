import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const secret = process.env.JWT_KEY

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]
		console.log(token)

		if (token) {
			const decoded = jwt.verify(token, secret)
			console.log(decoded)
			req.body._id = decoded?.id
		}
		
		next()
	} catch (error) { console.log(error) }
}

export default auth