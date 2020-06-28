import React from 'react'

import Tile from './Tile'

import styles from './Piece.module.sass'

import { PIECES } from '../../logic/chess'

const Piece = ({ info, size, pos, draggable }) => {
  //

  let pawnImage = null
  if (PIECES[info.type].image !== null)
    pawnImage = PIECES[info.type].image[info.side]

  return (
    <Tile
      className={styles.piece}
      size={size}
      x={pos.x}
      y={pos.y}
      draggable={draggable}
      animated
    >
      <div
        className={styles.image}
        style={{ backgroundImage: `url("${pawnImage}")` }}
      ></div>
    </Tile>
  )
}

export default Piece
