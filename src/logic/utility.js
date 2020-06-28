export const is_pos_equal = (a, b) => {
  return a.x === b.x && a.y === b.y
}

export const add_pos = (a, b) => {
  return { x: a.x + b.x, y: a.y + b.y }
}

export const sub_pos = (a, b) => {
  return { x: a.x - b.x, y: a.y - b.y }
}

export const angle_pos = (a, b) => {
  const delta = sub_pos(b, a)
  return Math.atan2(delta.y, delta.x)
}

export const UP = { x: 0, y: -1 }
export const DOWN = { x: 0, y: 1 }
export const LEFT = { x: -1, y: 0 }
export const RIGHT = { x: 1, y: 0 }
