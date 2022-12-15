import React from 'react'
import { Modal, useColorModeValue } from '@chakra-ui/react'

import FromUsersCard from '../FromUsersCard/FromUsersCard'

const FromUsersModal = ({ modalOpened, setModalOpened }) => {
  return (
    <Modal
      overlayColor={useColorModeValue('gray.50', 'gray.900')}
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >

    <FromUsersCard location='modal'/>
    </Modal>
  )
}

export default FromUsersModal
