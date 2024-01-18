import HeaderTeacher from '@/app/_components/Header/HeaderTeacher'
import Sidebar from '@/app/_components/Sidebar/Sidebar'
import { Suspense } from 'react'
import 'react-toastify/dist/ReactToastify.css';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <section className="">
      <HeaderTeacher />
      <div className='flex justify-end mt-[70px] '>
        <Sidebar />
        <div className="px-4 py-7 w-[calc(100%-254px)] min-h-svh bg-slate-50 pb-10">
          <Suspense fallback={<p>Loading data...</p>}>
            {children}
          </Suspense>
        </div>
      </div>
    </section>
  )
}
