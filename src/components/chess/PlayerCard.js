import React from 'react'

import placeholderImage from '../../assets/profile.svg'

import styles from './PlayerCard.module.sass'

const PlayerCard = ({ src, name, time, active }) => {
  return (
    <div className={styles.PlayerCard}>
      <img
        className={styles.profile_image}
        src={placeholderImage}
        alt={`${name} profile`}
      />
      <div className={styles.name}>{name}</div>
      <div>{time}</div>
    </div>
  )
}

PlayerCard.defaultProps = {
  src: placeholderImage,
  active: true,
  time: '10:00',
  name: 'Example',
}

export default PlayerCard
