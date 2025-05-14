import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const Navbar = () => {
  return (
    <div className='flex gap-x-5 items-center justify-end px-5 py-4'>
      <Input className='h-12 w-full max-w-xl' placeholder='search projects....'/>
      <Button size={'lg'}>Add New</Button>
    </div>
  )
}

export default Navbar
