import { Circle, useColorModeValue } from '@chakra-ui/react'
import { FaComments } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function StickyChat() {
	const navigate = useNavigate()
	const handleClick = () => navigate('/chat')

	return (
		<Circle bg={useColorModeValue('#1A202C', '#E2E8F0')} color={useColorModeValue('#E2E8F0', '#1A202C')} position='fixed' size={14} bottom={24} right={4} zIndex={2} shadow='dark-lg' cursor='pointer' onClick={handleClick}>
			<FaComments />
		</Circle>
	)
}