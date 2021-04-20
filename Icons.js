import React from 'react'
import Protypes from 'prop-types'
import styles from "./index.less"

export const DeleteIcon = props => (
  <div
    className={styles.rmc_iconcontainer}
    {...props}
  >
    <div className={styles.rmc_remove} />
  </div>

)

export const NumberIcon = ({ number }) => (
  <div className={styles.rmc_number}>
    {number}
  </div>
)

const { number } = Protypes

NumberIcon.propTypes = {
  number,
}

NumberIcon.defaultProps = {
  number: '',
}