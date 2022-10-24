import { ToastContainer as Toast, toast } from 'react-toastify'

import React from 'react'

const ToastContainer = () => (
  <Toast
    position="bottom-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  ></Toast>
)

export { ToastContainer, toast }
