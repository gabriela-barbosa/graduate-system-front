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

const showSavedToast = () => toast('Salvo com sucesso!')
const showDeletedToast = () => toast('Deletado com sucesso!')
const showErrorToast = errorMessage => toast.error(errorMessage)

export { ToastContainer, toast, showSavedToast, showDeletedToast, showErrorToast }
