import React from 'react'
import FromUsersCard from '../FromUsersCard/FromUsersCard'
import InfoCard from '../InfoCard/InfoCard'
import LogoSearch from '../LogoSearch/LogoSearch'

const ProfileLeft = () => {
  return (
    <div className="ProfileSide">
        <LogoSearch/>
        <InfoCard/>
    </div>
  )
}

export default ProfileLeft