import multer from 'multer'
import { Router } from 'express'

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'public/images'),
	filename: (req, file, cb) => cb(null, req.body.name)
})

const upload = multer({ storage })

export default new Router()
	.post('/', upload.single('file'), (req, res) => {
		try { return res.status(200).json('File uploaded successfully.') }
		catch (err) { console.error(err) }
	})