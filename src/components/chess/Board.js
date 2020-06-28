import React, { useState, useRef, useEffect } from 'react'

import styles from './Board.module.sass'

import useListState from '../../hooks/useListState'

import Tile from './Tile'
import Piece from './Piece'
import {
  get_piece,
  is_within_board,
  is_empty_piece,
  get_piece_info,
} from '../../logic/board'
import { is_pos_equal, angle_pos } from '../../logic/utility'

const Board = ({ tileSize, state, onMove }) => {
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [queuedMove, setQueuedMove] = useState(null)
  const { width, height, pieces, lastMove, info } = state
  const boardRef = useRef(null)
  const [arrowStart, setArrowStart] = useState(null)
  const { value: arrows, add: addArrows, clear: clearArrows } = useListState([])

  useEffect(() => {
    clearArrows()
  }, [state])

  useEffect(() => {
    if (queuedMove !== null) {
      onMove(queuedMove)
      setQueuedMove(null)
    }
  }, [queuedMove, onMove])

  const getCoordFromEvent = (e) => {
    const rect = boardRef.current.getBoundingClientRect()
    const pos = {
      x: Math.floor(((e.clientX - rect.left) / rect.width) * width),
      y: Math.floor(((e.clientY - rect.top) / rect.height) * height),
    }
    return pos
  }

  const handleMouseDown = (e) => {
    // if left mouse button
    if (e.button === 0) handleLeftMouseDown(e)
    // if right mouse button
    else handleRightMouseDown(e)
  }

  const handleRightMouseDown = (e) => {
    // get board location
    const pos = getCoordFromEvent(e)

    // break if pos outside of board
    if (!is_within_board(state, pos)) return null

    // set start
    setArrowStart(pos)

    document.addEventListener('mouseup', releaseMouseForArrowDraw)
  }

  const releaseMouseForArrowDraw = (e) => {
    setArrowStart((arrowStart) => {
      // skip if no arrow was started
      if (arrowStart === null) return null

      // get board location
      const pos = getCoordFromEvent(e)

      // break if pos outside of board
      if (!is_within_board(state, pos)) return null

      // add new arrow
      addArrows({ from: arrowStart, to: pos })

      // clear arrow start
      return null
    })
    document.removeEventListener('mouseup', releaseMouseForArrowDraw)
  }

  const handleLeftMouseDown = (e) => {
    const pos = getCoordFromEvent(e)

    // break if pos outside of board
    if (!is_within_board(state, pos)) return null

    // if no piece is selected
    if (selectedPiece === null) {
      // break if no piece exists
      if (is_empty_piece(state, pos)) return

      // break if the piece is not current mover
      const piece_id = get_piece(state, pos)
      if (get_piece_info(state, piece_id).side !== info.currentSide) return

      // select the piece for moving
      setSelectedPiece(pos)
      document.addEventListener('mouseup', releaseMouseForPieceMove)
    }

    // if a piece is selected -> second click move
    else {
      setQueuedMove({ from: selectedPiece, to: pos })
      setSelectedPiece(null)
    }
  }

  const releaseMouseForPieceMove = (e) => {
    setSelectedPiece((selectedPiece) => {
      const pos = getCoordFromEvent(e)

      // break if no piece is selected
      if (selectedPiece === null) return null

      // break if pos outside of board
      if (!is_within_board(state, pos)) return null

      // click move (if release is in same place)
      if (is_pos_equal(selectedPiece, pos)) {
        return selectedPiece
      }

      // dragging release
      else {
        setQueuedMove({ from: selectedPiece, to: pos })
        return null
      }
    })
    document.removeEventListener('mouseup', releaseMouseForPieceMove)
  }

  const lastMove_component = lastMove && (
    <div>
      <Tile size={tileSize} shade='green' {...lastMove.from}></Tile>
      <Tile size={tileSize} shade='green' {...lastMove.to}></Tile>
    </div>
  )

  const selectedPiece_component = selectedPiece && (
    <Tile size={tileSize} shade='yellow' {...selectedPiece} />
  )

  const pieces_component = (
    <div>
      {pieces.map((piece, index) => {
        // skip deleted pieces
        if (piece.pos === null) return null

        // determine if draggable
        const draggable =
          state.info.currentSide === piece.info.side &&
          (selectedPiece === null || is_pos_equal(selectedPiece, piece.pos))

        return (
          <Piece key={index} size={tileSize} draggable={draggable} {...piece} />
        )
      })}
    </div>
  )

  const arrows_component = (
    <svg className={styles.arrows} viewBox='0 0 100 100'>
      {arrows.map(({ from, to }, index) => {
        const xCenterOffset = 100 / width / 2
        const yCenterOffset = 100 / height / 2
        const fx = (from.x / width) * 100 + xCenterOffset
        const fy = (from.y / height) * 100 + yCenterOffset

        // circle
        if (is_pos_equal(from, to)) {
          return <circle key={index} cx={fx} cy={fy} r='0.35rem' fill='none' />
        }

        // arrow
        else {
          const arrow_length = 5
          const angle = angle_pos(to, from)
          const span = 20 // deg
          const tx = (to.x / width) * 100 + xCenterOffset
          const ty = (to.y / height) * 100 + yCenterOffset
          return (
            <g key={index}>
              <path d={`M ${fx},${fy} ${tx},${ty}`} />
              <path
                d={`M ${tx},${ty} ${
                  tx + Math.cos(angle + (span / 180) * Math.PI) * arrow_length
                },${
                  ty + Math.sin(angle + (span / 180) * Math.PI) * arrow_length
                }`}
              />
              <path
                d={`M ${tx},${ty} ${
                  tx + Math.cos(angle - (span / 180) * Math.PI) * arrow_length
                },${
                  ty + Math.sin(angle - (span / 180) * Math.PI) * arrow_length
                }`}
              />
            </g>
          )
        }
      })}
    </svg>
  )

  const preventDefault = (e) => {
    e.preventDefault()
  }

  return (
    <div
      className={styles.board}
      ref={boardRef}
      onMouseDown={handleMouseDown}
      onContextMenu={preventDefault}
      style={{
        width: `calc(${tileSize} * ${width})`,
        height: `calc(${tileSize} * ${height})`,
      }}
    >
      {lastMove_component}
      {selectedPiece_component}
      {pieces_component}
      {arrows_component}
    </div>
  )
}

Board.defaultProps = {
  tileSize: '5rem',
}

export default Board
