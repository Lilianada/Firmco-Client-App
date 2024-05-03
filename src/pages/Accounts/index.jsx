import React from 'react'
import Overview from './Overview'
import Tabs from './Tabs'
import { useSelector } from 'react-redux'

export default function AccountsOverview() {
  const username = useSelector(state => state.user.name);
  return (
    <div className='grid gap-12'>
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Welcome {username},
        </h2>
      </div>
      <Overview />
      <Tabs/>
    </div>
  )
}
