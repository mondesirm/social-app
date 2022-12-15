import React, { useEffect, useRef, useState } from 'react'

//! import { format } from 'timeago.js'
import { useDispatch } from 'react-redux'
import InputEmoji from 'react-input-emoji'

import './ChatBox.css'
import * as User from '../../api/UserRequests'
import * as Message from '../../api/MessageRequests'
import { useAuth } from '../../contexts/AuthContext'

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
	const { upload } = useAuth()
	const [userData, setUserData] = useState(null)
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const [image, setImage] = useState(null)
	const dispatch = useDispatch()

	const handleChange = newMessage => {
		setNewMessage(newMessage)
	}

	/* const onImageChange = event => {
		if (event.target.files && event.target.files[0]) {
			let img = event.target.files[0]
			setImage(img)
		}
	} */

	useEffect(() => {
		const userId = chat?.members?.find(id => id !== currentUser)
		const getUserData = async () => {
			try {
				const { data } = await User.one(userId)
				setUserData(data)
			} catch (error) {
				console.log(error)
			}
		}

		if (chat !== null) getUserData()
	}, [chat, currentUser])

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const { data } = await Message.of(chat._id)
				setMessages(data)
			} catch (error) {
				console.log(error)
			}
		}

		if (chat !== null) fetchMessages()
	}, [chat])

	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const handleSend = async e => {
		e.preventDefault()

		if (newMessage.replace(/\s/g, '') === '') return

		const message = {
			senderId: currentUser,
			text: newMessage,
			chatId: chat._id,
		}

		if (image) {
			const data = new FormData()
			const fileName = Date.now() + image.name
			data.append('name', fileName)
			data.append('file', image)
			newMessage.image = fileName
			console.log(newMessage)

			try {
				dispatch(image(data))
			} catch (err) {
				console.log(err)
			}
		}

		const receiverId = chat.members.find(id => id !== currentUser)

		// send message to socket server
		setSendMessage({ ...message, receiverId })

		// send message to database
		try {
			const { data } = await Message.create(message)
			setMessages([...messages, data])
			setNewMessage('')
			resetUpload()
		} catch {
			console.log('error')
		}
	}

	// Receive Message from parent component
	useEffect(() => {
		// console.log('Message Arrived: ', receivedMessage)
		if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
			setMessages([...messages, receivedMessage])
		}
	}, [receivedMessage])

	const scroll = useRef()
	const imageRef = useRef()

	const resetUpload = () => {
		setImage(null)
	}

	return (
		<>
			<div className='ChatBox-container'>
				{chat ? (
					<>
						{/* chat-header */}
						<div className='chat-header'>
							<div className='fromUser'>
								<div>
									<img
										src={'/images/defaultProfile.png'}
										alt='Profile'
										className='fromUserImage'
										style={{
											width: '50px',
											height: '50px',
										}}
									/>
									<div
										className='name'
										style={{ fontSize: '0.9rem' }}
									>
										<span>
											{userData?.firstName}{' '}
											{userData?.lastName}
										</span>
									</div>
								</div>
							</div>
							<hr
								style={{
									width: '95%',
									border: '0.1px solid #ececec',
									marginTop: '20px',
								}}
							/>
						</div>
						{/* chat-body */}
						<div className='chat-body'>
							{messages.map(message => (
								<>
									<div
										ref={scroll}
										className={
											message.senderId === currentUser
												? 'message own'
												: 'message'
										}
									>
										<span>{message.text}</span>{' '}
										<span>{message.createdAt}</span>
									</div>
								</>
							))}
						</div>
						{/* chat-sender */}
						<div className='chat-sender'>
							<div onClick={() => imageRef.current.click()}>
								+
							</div>
							
							<InputEmoji
								value={newMessage}
								onChange={handleChange}
								onKeyDown={async e => e.key === 'Enter' && handleSend(e) }
								// ref={inputRef}
							/>
							<div
								className='send-button button'
								onClick={handleSend}
							>
								Send
							</div>
							<input
								type='file'
								name=''
								id=''
								style={{ display: 'none' }}
								ref={imageRef}
								// onChange={handleImage}
							/>
						</div>{' '}
					</>
				) : (
					<span className='chatbox-empty-message'>
						Tap on a chat to start conversation...
					</span>
				)}
			</div>
		</>
	)
}

export default ChatBox