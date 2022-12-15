import React from 'react'

import './Timeline.css'
import ProfileSide from '../components/ProfileSide/ProfileSide'
import RightSide from '../components/RightSide/RightSide'

export default function Timeline() {
	return (
		<div className='Timeline'>
			<ProfileSide />
			<RightSide />
		</div>
	)
}