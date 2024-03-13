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

  const nowCount = data?.result?.now || 0;
  const tomorrowCount = data?.result?.tomorrow || 0;


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {nowCount > 0 &&
        (
          <>
            <div>
            <div>You have {nowCount} flashcards due to review.</div>
            {tomorrowCount && <div>You have {tomorrowCount} flashcards due to review tomorrow.</div>}
            </div>
            <button className="mx-2 hover:bg-blue-700 px-2 py-1 rounded bg-blue-500 text-white" onClick={() => router.push('/learn')}>start review</button>
          </>
          )
        }
        {nowCount == 0 &&
        (
          <>
            <div>You have no flashcards due to review.</div>
          </>
          )
        }
    </main>
  )
}
