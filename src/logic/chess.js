import {
  introduce_piece,
  create_board,
  get_piece,
  get_piece_info,
  __clone_board,
} from './board'
import { is_pos_equal, UP, DOWN, LEFT, RIGHT } from './utility'

// assets
import w_pawn from '../assets/w_pawn.svg'
import b_pawn from '../assets/b_pawn.svg'
import w_rook from '../assets/w_rook.svg'
import b_rook from '../assets/b_rook.svg'
import w_knight from '../assets/w_knight.svg'
import b_knight from '../assets/b_knight.svg'
import w_bishop from '../assets/w_bishop.svg'
import b_bishop from '../assets/b_bishop.svg'
import w_queen from '../assets/w_queen.svg'
import b_queen from '../assets/b_queen.svg'
import w_king from '../assets/w_king.svg'
import b_king from '../assets/b_king.svg'

//const get_possible_moves = (board, pos) => {}

export const create_chess_board = () => {
  // create initial board
  let board = create_board(8, 8, {
    currentSide: 'white',
  })

  // pawn rows
  for (let i = 0; i < 8; i++) {
    board = introduce_piece(
      board,
      { x: i, y: 1 },
      { type: 'pawn', side: 'black' }
    )
    board = introduce_piece(
      board,
      { x: i, y: 6 },
      { type: 'pawn', side: 'white' }
    )
  }

  // other two
  const sideParts = [
    { y: 0, side: 'black' },
    { y: 7, side: 'white' },
  ]
  const typeParts = [
    'rook',
    'knight',
    'bishop',
    'queen',
    'king',
    'bishop',
    'knight',
    'rook',
  ]

  typeParts.forEach((type, x) => {
    sideParts.forEach(({ y, side }) => {
      board = introduce_piece(board, { x: x, y: y }, { type: type, side: side })
    })
  })

  return board
}

export const is_valid_chess_move = (board, from, to) => {
  // cannot move where you already from
  if (is_pos_equal(from, to)) return false

  // get info
  const to_id = get_piece(board, to)
  const from_id = get_piece(board, from)
  const { type: from_type, side: from_side } = get_piece_info(board, from_id)

  // cannot make move for other side
  if (from_side !== board.info.currentSide) return false

  // if attempting a capture
  const attempted_capture = to_id !== null
  if (attempted_capture) {
    const { type: to_type, side: to_side } = get_piece_info(board, to_id)

    // cannot capture same side
    if (from_side === to_side) return false

    // cannot capture a king
    if (to_type === 'king') return false
  }

  return true
}

export const next_turn = (board) => {
  let newBoard = __clone_board(board)
  const prev_side = board.info.currentSide
  if (prev_side === 'white') newBoard.info.currentSide = 'black'
  else newBoard.info.currentSide = 'white'
  return newBoard
}

export const PIECES = {
  pawn: {
    name: 'pawn',
    image: { white: w_pawn, black: b_pawn },
  },
  rook: {
    name: 'rook',
    image: { white: w_rook, black: b_rook },
  },
  bishop: {
    name: 'bishop',
    image: { white: w_bishop, black: b_bishop },
  },
  king: {
    name: 'king',
    image: { white: w_king, black: b_king },
  },
  queen: {
    name: 'queen',
    image: { white: w_queen, black: b_queen },
  },
  knight: {
    name: 'knight',
    image: { white: w_knight, black: b_knight },
  },
}
