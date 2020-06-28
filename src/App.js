import React from 'react'

import styles from './App.module.sass'

import Game from './components/chess/Game'

function App() {
  return (
    <div className={styles.app}>
      <Game />
    </div>
  )
}

export default App
