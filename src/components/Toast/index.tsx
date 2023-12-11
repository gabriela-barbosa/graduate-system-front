import { ToastContainer as Toast, toast, TypeOptions } from 'react-toastify'

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
  />
)

const showSavedToast = () => toast.success('Salvo com sucesso!')
const showEditedToast = () => toast.success('Editado com sucesso!')
const showDeletedToast = () => toast.success('Deletado com sucesso!')
const showErrorToast = (errorMessage: string) => toast.error(errorMessage)
const showToast = (message: string, type?: TypeOptions) => toast(message, { type })

export {
  ToastContainer,
  toast,
  showSavedToast,
  showDeletedToast,
  showErrorToast,
  showToast,
  showEditedToast,
}
