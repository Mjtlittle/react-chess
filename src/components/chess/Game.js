import React, { useState } from 'react'

import Board from './Board'

import styles from './Game.module.sass'

import { move_piece, __clone_board } from '../../logic/board'
import useListState from '../../hooks/useListState'
import {
  is_valid_chess_move,
  create_chess_board,
  next_turn,
} from '../../logic/chess'
import PlayerCard from './PlayerCard'

import { IconContext } from 'react-icons'
import { FaUndo, FaTrashAlt, FaDiceFive } from 'react-icons/fa'

const Game = () => {
  const [state, setState] = useState(create_chess_board())
  const {
    value: stateHistory,
    add: addStateHistory,
    pop: popStateHistory,
    set: setStateHistory,
  } = useListState([])

  const moveCallback = (move) => {
    // check move validity
    if (is_valid_chess_move(state, move.from, move.to)) {
      // add old state to the history
      addStateHistory(state)

      // move the piece
      let newState = move_piece(state, move.from, move.to)

      // switch sides
      newState = next_turn(newState)

      // apply new state
      setState(newState)
    }
  }

  const undoMove = () => {
    const newState = popStateHistory()
    if (newState) setState(newState)
  }

  const resetGame = () => {
    const newState = create_chess_board()
    setState(newState)
    setStateHistory([])
  }

  const shuffleBoard = () => {
    const newState = __clone_board(state)

    let collected_pieces = []

    // collect pieces
    newState.grid = newState.grid.map((row) => {
      return row.map((piece_id, index) => {
        if (piece_id !== null) {
          collected_pieces.push(piece_id)
          newState.pieces[piece_id].pos = null
        }

        return null
      })
    })

    // randomly place pieces
    let rx, ry, newPos
    while (collected_pieces.length > 0) {
      rx = Math.floor(Math.random() * state.width)
      ry = Math.floor(Math.random() * state.height)
      if (newState.grid[ry][rx] === null) {
        let id = collected_pieces.pop()
        newState.grid[ry][rx] = id
        newState.pieces[id].pos = { x: rx, y: ry }
      }
    }
    setStateHistory([])
    setState(newState)
  }

  return (
    <div className={styles.game}>
      <Board state={state} onMove={moveCallback} />
      <div className={styles.top_bar}>
        <div className={styles.controls}>
          <IconContext.Provider
            value={{ className: styles.icon, size: '1.5rem' }}
          >
            <FaUndo onClick={undoMove} />
            <FaTrashAlt onClick={resetGame} />
            <FaDiceFive onClick={shuffleBoard} />
          </IconContext.Provider>
        </div>
        <div className={styles.info}>
          <div className={styles.info_point}>
            <b>Current Turn: </b>
            {state.info.currentSide} ({stateHistory.length})
          </div>
        </div>
      </div>
      <div className={styles.bottom_bar}>
        <span>
          <b>react-chess</b> {'... just the ui :P'}
        </span>
        <span>
          <b>by:</b> <a href='https://github.com/Mjtlittle'>Joshua Little</a>
        </span>
      </div>
    </div>
  )
}

export default Game
