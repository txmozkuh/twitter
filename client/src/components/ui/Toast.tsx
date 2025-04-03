import { DefaultToastOptions, Toaster } from 'react-hot-toast'

const toastConfig: DefaultToastOptions | undefined = {
  // Define default options
  position: 'top-center',
  className: '',
  duration: 2000,
  removeDelay: 1000,
  style: {
    width: 'fit',
    background: '#fff',
    color: '#000'
  },

  // Default options for specific types
  success: {
    duration: 3000,
    iconTheme: {
      primary: 'green',
      secondary: 'white'
    }
  }
}

export default function CustomToast() {
  return <Toaster toastOptions={toastConfig} />
}
