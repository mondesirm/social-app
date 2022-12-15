import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, chakra, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, HStack, Input, Stack, useToast } from '@chakra-ui/react'

import { Card } from '../../components/Card'
import { Layout } from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
	const { isAuthenticating, login } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const [inputs, setInputs] = useState({ identifier: '', password: '' })
	const [errors, setErrors] = useState(inputs)
	const toast = useToast({ isClosable: true, status: 'success' })
	const dispatch = useDispatch()

	const handleChange = ({ target: { name, value } }) => {
		setInputs(values => ({ ...values, [name]: value }))
		setErrors(values => ({ ...values, [name]: value === '' ? true : false }))
	}
	
	const handleSubmit = async e => {
		e.preventDefault()

		if (!inputs.identifier || !inputs.password) {
			toast({ description: 'Missing email or password.', status: 'error' })
			return
		}

		dispatch(login(inputs, navigate, location))
	}

	return (
		<Layout>
			<Heading textAlign='center' my={12}>Login</Heading>

			<Card maxW='md' mx='auto' mt={4}>
				<chakra.form onSubmit={handleSubmit}>
					<Stack spacing='6'>
						<FormControl id='identifier' isRequired isInvalid={errors.identifier}>
							<FormLabel>Identifier (Email / Username)</FormLabel>
							<Input name='identifier' type='text' autoComplete='identifier' autoFocus value={inputs.identifier} required onBlur={handleChange} onChange={handleChange} />

							{!errors.identifier
								? (<FormHelperText>Enter a valid identifier.</FormHelperText>)
								: (<FormErrorMessage>Identifier is required.</FormErrorMessage>)
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

						<Button type='submit' colorScheme='pink' size='lg' fontSize='md' isLoading={isAuthenticating}>Sign In</Button>
					</Stack>
				</chakra.form>

				<HStack justifyContent='space-between' my={4}>
					<Button variant='link'>
						<Link to='/forgot-password'>Forgot password?</Link>
					</Button>

					<Button variant='link' onClick={() => navigate('/register')}>Not registered yet?</Button>
				</HStack>
			</Card>
		</Layout>
	)
}