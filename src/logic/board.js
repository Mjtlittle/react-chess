export const create_board = (width, height, info) => {
  let grid = []
  for (let i = 0; i < height; i++) {
    grid.push([])
    for (let j = 0; j < width; j++) {
      grid[i].push(null)
    }
  }

  return {
    width: width,
    height: height,
    grid: grid,
    pieces: [],
    info: info,
    lastMove: null,
    capturedPieces: {
      white: [],
      black: [],
    },
  }
}

export const get_piece_info = (board, piece_id) => {
  return board.pieces[piece_id].info
}

export const get_piece_pos = (board, piece_id) => {
  return board.pieces[piece_id].pos
}

export const __clone_piece = (piece) => {
  return { ...piece }
}

export const __clone_board = (board) => {
  return {
    ...board,
    info: { ...board.info },
    grid: board.grid.map((row) => row.slice()),
    pieces: board.pieces.map(__clone_piece),
  }
}

const __create_piece = (board, info) => {
  const newPiece = {
    pos: null,
    info: info,
  }
  const newPieceId = board.pieces.length

  // clone board and add new piece
  let newBoard = __clone_board(board)
  newBoard.pieces.push(newPiece)
  return [newBoard, newPieceId]
}

export const introduce_piece = (board, pos, info) => {
  let [newBoard, id] = __create_piece(board, info)
  newBoard = set_piece(newBoard, pos, id)
  return newBoard
}

const __update_piece_pos = (board, piece_id, pos) => {
  let newBoard = __clone_board(board)
  newBoard.pieces[piece_id].pos = pos
  return newBoard
}

const __get_grid_pos = (board, pos) => {
  return board.grid[pos.y][pos.x]
}

export const get_piece = (board, pos) => {
  return __get_grid_pos(board, pos)
}

export const is_within_board = (board, pos) =>
  pos.x >= 0 && pos.x < board.width && pos.y >= 0 && pos.y < board.height

export const is_empty_piece = (board, pos) => {
  return __get_grid_pos(board, pos) === null
}

const set_piece = (board, pos, piece_id) => {
  let newBoard = __clone_board(board)

  // update current piece at pos if exists
  const currentPiece = __get_grid_pos(newBoard, pos)
  if (currentPiece !== null) {
    newBoard = __update_piece_pos(newBoard, currentPiece, null)
  }

  // replace with new piece
  newBoard.grid[pos.y][pos.x] = piece_id
  if (piece_id !== null) {
    newBoard = __update_piece_pos(newBoard, piece_id, pos)
  }

  return newBoard
}

const delete_piece = (board, pos) => {
  return set_piece(board, pos, null)
}

export const move_piece = (board, from, to) => {
  const movingPiece = get_piece(board, from)
  let newBoard = delete_piece(board, from)
  newBoard = set_piece(newBoard, to, movingPiece)
  newBoard.lastMove = { from: from, to: to }
  return newBoard
}
