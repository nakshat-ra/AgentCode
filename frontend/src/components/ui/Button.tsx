import React from 'react'

const Button = ({children}: {children: React.ReactNode}) => {
  return (
    <button className='bg-black text-white px-3 text-sm m-3 font-medium rounded-sm cursor-pointer'> {children}</button>
  )
}

export default Button