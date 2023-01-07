import { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { Circle, Collapse, useColorModeValue } from '@chakra-ui/react'

export default function StickyTop() {
	// Show the button when the page is scrolled more than 300px
	const [showScroll, setShowScroll] = useState(false)

	
	useEffect(() => {
		const checkScrollTop = () => {
			if (!showScroll && window.pageYOffset > 300) {
				setShowScroll(true)
			} else if (showScroll && window.pageYOffset <= 300) {
				setShowScroll(false)
			}
		}

		window.addEventListener('scroll', checkScrollTop)
		return () => window.removeEventListener('scroll', checkScrollTop)
	}, [showScroll])

	const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })

	return (
		<Collapse in={showScroll} animateOpacity>
			<Circle bg={useColorModeValue('#1A202C', '#E2E8F0')} color={useColorModeValue('#E2E8F0', '#1A202C')} position='fixed' size={14} bottom={4} right={4} zIndex={2} shadow='dark-lg' cursor='pointer' onClick={handleClick}>
				<FaArrowUp />
			</Circle>
		</Collapse>
	)
}