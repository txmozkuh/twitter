import { useRef } from 'react'
import { FieldValues, Path, UseFormRegister } from 'react-hook-form'

interface FormInputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>
  errorMessage?: string
  placeholder: string
  name: Path<T>
}

export default function FormInput<T extends FieldValues>({
  name,
  type = 'text',
  className,
  register,
  errorMessage,
  placeholder,
  ...props
}: FormInputProps<T>) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className=''>
      <div
        tabIndex={0}
        className='group ring-border-grey focus-within:ring-blue-sky relative box-border overflow-hidden rounded-sm p-2 ring-2 transition-all duration-150 outline-none'
        onFocus={() => ref.current?.focus()}
      >
        <input
          type={type}
          {...register(name)}
          className={`${className} peer outline-none' mt-4 w-full`}
          placeholder=''
          ref={(e) => {
            ref.current = e
            if (register && name && e) {
              register(name).ref(e)
            }
          }}
          {...props}
        />
        <div className='group-focus-within:text-blue-sky text-border-grey absolute top-1 text-sm transition-all peer-placeholder-shown:top-[25%] peer-placeholder-shown:text-xl peer-focus-within:top-1 peer-focus-within:text-sm'>
          {placeholder}
        </div>
      </div>
      <div className='mt-1 min-h-2 text-center text-sm text-red-600'>{errorMessage} </div>
    </div>
  )
}
