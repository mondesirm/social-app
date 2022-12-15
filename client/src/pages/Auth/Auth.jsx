import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Auth = () => {
	const { isAuthenticating, login, register } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const dispatch = useDispatch()
	const [isSignUp, setIsSignUp] = useState(false)

	const [data, setData] = useState({ firstName: '', lastName: '', identifier: '', email: '', username: '', password: '', confirm: '' })

	const [confirm, setConfirm] = useState(true)

	// Reset Form
	const resetForm = () => {
		setData({ ...data, password: '', confirm: '' })
		setConfirm(confirm)
	}

	// handle Change in input
	const handleChange = e => {
		setData({ ...data, [e.target.name]: e.target.value })
	}

	// Form Submission
	const handleSubmit = e => {
		setConfirm(true)
		e.preventDefault()
		if (isSignUp) {
			data.password === data.confirm
				? dispatch(register(data, navigate, location))
				: setConfirm(false)
		} else {
			dispatch(login(data, navigate, location))
		}
	}

	return (
		<div className='Auth'>
			{/* left side */}

			<div className='a-left'>
				<div className='Webname'>
					<h1>Social App</h1>
					<h6>
						Share your hobbies, interests, and more with friends.
					</h6>
				</div>
			</div>

			{/* right form side */}

			<div className='a-right'>
				<form className='infoForm authForm' onSubmit={handleSubmit}>
					<h3>{isSignUp ? 'Register' : 'Login'}</h3>
					{isSignUp ? (<>
						<div>
							<input
								required
								type='text'
								placeholder='First Name'
								className='infoInput'
								name='firstName'
								value={data.firstName}
								onChange={handleChange}
							/>
							<input
								required
								type='text'
								placeholder='Last Name'
								className='infoInput'
								name='lastName'
								value={data.lastName}
								onChange={handleChange}
							/>
						</div>

						<div>
							<input
								required
								type='text'
								placeholder='Username'
								className='infoInput'
								name='username'
								value={data.username}
								onChange={handleChange}
							/>
						</div>
					</>) : (
						<div>
							<input
								required
								type='text'
								placeholder='Identifier'
								className='infoInput'
								name='identifier'
								value={data.identifier}
								onChange={handleChange}
							/>
						</div>
					)}

					<div>
						<input
							required
							type='password'
							className='infoInput'
							placeholder='Password'
							name='password'
							value={data.password}
							onChange={handleChange}
						/>
						{isSignUp && (
							<input
								required
								type='password'
								className='infoInput'
								name='confirm'
								placeholder='Confirm Password'
								onChange={handleChange}
							/>
						)}
					</div>

					<span
						style={{
							color: 'red',
							fontSize: '12px',
							alignSelf: 'flex-end',
							marginRight: '5px',
							display: confirm ? 'none' : 'block',
						}}
					>
						*Confirm password is not same
					</span>
					<div>
						<span
							style={{
								fontSize: '12px',
								cursor: 'pointer',
								textDecoration: 'underline',
							}}
							onClick={() => {
								resetForm()
								setIsSignUp(prev => !prev)
							}}
						>
							{isSignUp
								? 'Already have an account?'
								: 'Not registered yet?'}
						</span>
						<button
							className='button infoButton'
							type='Submit'
							disabled={isAuthenticating}
						>
							{isAuthenticating
								? 'Authenticating...'
								: isSignUp
								? 'SignUp'
								: 'Login'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Auth