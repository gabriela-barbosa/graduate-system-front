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
  ></Toast>
)

const showSavedToast = () => toast.success('Salvo com sucesso!')
const showEditedToast = () => toast.success('Editado com sucesso!')
const showDeletedToast = () => toast.success('Deletado com sucesso!')
const showErrorToast = (errorMessage: string) => toast.error(errorMessage)
const showToast = (errorMessage: string, type?: TypeOptions) => toast(errorMessage, { type })

export {
  ToastContainer,
  toast,
  showSavedToast,
  showDeletedToast,
  showErrorToast,
  showToast,
  showEditedToast,
}
