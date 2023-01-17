import { useState } from 'react'
import { useDispatch  } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, FormHelperText, FormErrorMessage, Center, chakra, FormControl, FormLabel, Heading, Input, Stack, useToast } from '@chakra-ui/react'

import { Card } from '../../components/Card'
import useMounted from '../../hooks/useMounted'
import { Layout } from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'

export default function Register() {
	const { register } = useAuth()
	const mounted = useMounted()
	const dispatch = useDispatch()
	const location = useLocation()
	const navigate = useNavigate()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const toast = useToast({ isClosable: true, status: 'success' })
	const [inputs, setInputs] = useState({ firstName: '', lastName: '', username: '', email: '', password: '' })
	const [errors, setErrors] = useState(inputs)

	const handleChange = ({ target: { name, value } }) => {
		setInputs(values => ({ ...values, [name]: value }))
		setErrors(values => ({ ...values, [name]: value === '' ? true : false }))
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (!inputs.email || !inputs.password) {
			toast({ description: 'Missing email or password.', status: 'error' })
			return
		}

		setIsSubmitting(true)

		dispatch(register(inputs, navigate, location))
		mounted.current && setIsSubmitting(false)
	}

	return (
		<Layout>
			<Heading textAlign='center' my={12}>Register</Heading>

			<Card maxW='md' mx='auto' mt={4}>
				<chakra.form onSubmit={handleSubmit}>
					<Stack spacing='6'>
						<FormControl id='firstName' isRequired isInvalid={errors.firstName}>
							<FormLabel>First Name</FormLabel>
							<Input name='firstName' type='text' autoComplete='firstName' autoFocus value={inputs.firstName} onBlur={handleChange} onChange={handleChange} />

							{!errors.firstName
								? (<FormHelperText>Enter a valid first name.</FormHelperText>)
								: (<FormHelperText>First name is required.</FormHelperText>)
							}
						</FormControl>

						<FormControl id='lastName' isRequired isInvalid={errors.lastName}>
							<FormLabel>Last Name</FormLabel>
							<Input name='lastName' type='text' autoComplete='lastName' value={inputs.lastName} onBlur={handleChange} onChange={handleChange} />

							{!errors.lastName
								? (<FormHelperText>Enter a valid last name.</FormHelperText>)
								: (<FormHelperText>Last name is required.</FormHelperText>)
							}
						</FormControl>

						<FormControl id='username' isRequired isInvalid={errors.username}>
							<FormLabel>Username</FormLabel>
							<Input name='username' type='username' autoComplete='username' value={inputs.username} required onBlur={handleChange} onChange={handleChange} />

							{!errors.username
								? (<FormHelperText>Enter a valid username.</FormHelperText>)
								: (<FormErrorMessage>Username is required.</FormErrorMessage>)
							}
						</FormControl>

						<FormControl id='email' isRequired isInvalid={errors.email}>
							<FormLabel>Email Address</FormLabel>
							<Input name='email' type='email' autoComplete='email' value={inputs.email} required onBlur={handleChange} onChange={handleChange} />

							{!errors.email
								? (<FormHelperText>Enter a valid email address.</FormHelperText>)
								: (<FormErrorMessage>Email address is required.</FormErrorMessage>)
							}
						</FormControl>

						<FormControl id='password' isRequired isInvalid={errors.password}>
							<FormLabel>Password</FormLabel>
							<Input name='password' type='password' autoComplete='password' value={inputs.password} required onBlur={handleChange} onChange={handleChange} />

							{!errors.password
								? (<FormHelperText>Enter a valid password.</FormHelperText>)
								: (<FormErrorMessage>Password is required.</FormErrorMessage>)
							}
						</FormControl>

						<Button type='submit' colorScheme='pink' size='lg' fontSize='md' isLoading={isSubmitting}>Register</Button>
					</Stack>
				</chakra.form>

				<Center my={4}>
					<Button variant='link' onClick={() => navigate('/login')}>Already have an account?</Button>
				</Center>

				{/* <Separator my={6}>OR</Separator> */}

				{/* <Button variant='outline' isFullWidth colorScheme='red' leftIcon={<FaGoogle />} onClick={handleGoogleSignIn}>Sign In with Google</Button> */}
			</Card>
		</Layout>
	)
}