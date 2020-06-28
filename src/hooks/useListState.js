import { useState } from 'react'

const useListState = (initial) => {
  const [list, setList] = useState(initial)

  const add = (item) => {
    setList([...list, item])
  }

  const remove = (index) => {
    setList(list.filter((_, i) => i !== index))
  }

  const pop = () => {
    if (list.length === 0) return null
    const last = list[list.length - 1]
    remove(list.length - 1)
    return last
  }

  const clear = () => {
    setList([])
  }

  return {
    value: list,
    add: add,
    remove: remove,
    pop: pop,
    set: setList,
    clear: clear,
  }
}

export default useListState
