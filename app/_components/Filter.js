'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function Filter() {

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const active = searchParams.get('capacity') ?? 'all'

  const handleFilter = (filter) => {
    const params = new URLSearchParams(searchParams) //Web API
    params.set('capacity', filter)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="border border-primary-800 flex">
      <Button filter='all' handleFilter={handleFilter} active={active}>All cabins</Button>
      <Button filter='small' handleFilter={handleFilter} active={active}>1&mdash;3 guests</Button>
      <Button filter='medium' handleFilter={handleFilter} active={active}>4&mdash;7 guests</Button>
      <Button filter='large' handleFilter={handleFilter} active={active}>8&mdash;12 guests</Button>
    </div>
  )
}

function Button({ children, handleFilter, filter, active }) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${active === filter ? 'bg-primary-700 text-primary-50' : ''}`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  )
}