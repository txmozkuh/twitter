import CustomToast from '@/components/ui/Toast'
import RouterElements from '@routes/router'
export default function App() {
  return (
    <div className='mx-auto grid h-screen max-w-[1325px] place-items-center'>
      <CustomToast />
      <RouterElements />
    </div>
  )
}
