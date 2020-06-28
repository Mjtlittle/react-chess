import React, { useState, useRef } from 'react'

import styles from './Tile.module.sass'

const Tile = ({
  className,
  size,
  x,
  y,
  children,
  draggable,
  animated,
  shade,
}) => {
  const [dragPos, setDragPos] = useState(null)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef(null)

  const onMouseMove = (e) => {
    const ref = dragRef.current
    const prect = ref.parentElement.getBoundingClientRect()
    const newPos = {
      x: (e.clientX - prect.left) / ref.offsetWidth - 0.5,
      y: (e.clientY - prect.top) / ref.offsetHeight - 0.5,
    }
    setDragPos(newPos)
  }

  const onMouseUp = (e) => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    setDragging(false)
  }

  const onMouseDown = (e) => {
    // if draggable and it is a left click drag
    if (draggable && e.button === 0) {
      e.preventDefault()
      document.addEventListener('mouseup', onMouseUp)
      document.addEventListener('mousemove', onMouseMove)
      setDragging(true)
      setDragPos({ x: x, y: y })
    }
  }

  let classes = [styles.tile, className]
  if (dragging) classes.push(styles.dragging)
  if (draggable) classes.push(styles.draggable)
  if (animated) classes.push(styles.animated)

  let tx = x
  let ty = y
  if (dragging) {
    tx = dragPos.x
    ty = dragPos.y
  }

  let scale = 1
  if (dragging) {
    scale = 1.1
  }

  let shadeStyle = {}
  if (shade !== undefined) {
    shadeStyle.backgroundColor = shade
    shadeStyle.opacity = '0.4'
  }

  let transform = [`translate(${tx * 100}%,${ty * 100}%)`, `scale(${scale})`]

  return (
    <div
      className={classes.join(' ')}
      onMouseDown={onMouseDown}
      ref={dragRef}
      style={{
        ...shadeStyle,
        width: size,
        height: size,
        transform: transform.join(' '),
      }}
    >
      {children}
    </div>
  )
}

Tile.defaultProps = {
  animated: false,
  draggable: false,
  shade: undefined,
}

export default Tile
