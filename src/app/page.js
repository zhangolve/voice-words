"use client"
import { useRouter } from 'next/navigation'
import useSWR from "swr";
import { fetcher } from './utils'
import Loading from './components/Loading'

export default function Home() {
  const router = useRouter()
  const { data, error, isLoading } = useSWR({url: `/api/due-date-count`}, fetcher);


  if(isLoading) {
    return <Loading />
  }

  const count = data?.result || 0;


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
        {count == 0 &&
        (
          <>
            <div>You have no flashcards due to review.</div>
          </>
          )
        }
    </main>
  )
}
