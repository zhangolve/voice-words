"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'



export default function Home() {
  const [count, setCount] = useState(0)
  const router = useRouter()

  useEffect(()=>{
    fetch('/api/due-date-count', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(data => {
        setCount(data.result)
      })
      .catch(err => console.log(err))
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {count > 0 &&
        (
          <>
            <div>You have {count} flashcards due to review.</div>
            <button className="mx-2 hover:bg-blue-700 px-2 py-1 rounded bg-blue-500 text-white" onClick={() => router.push('/learn')}>start review</button>
          </>
          )
        }
        {count === 0 &&
        (
          <>
            <div>You have no flashcards due to review.</div>
          </>
          )
        }
    </main>
  )
}
