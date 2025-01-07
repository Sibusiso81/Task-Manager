import React from 'react'
import logout from '../Auth/Actions/Actions'

function page() {
  return (
    <div>Tasks

      <button onClick={logout} >Log out </button>
    </div>
  )
}

export default page