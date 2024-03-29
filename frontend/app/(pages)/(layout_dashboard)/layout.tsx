import Sidebar from '@/app/_components/Sidebar/Sidebar'
import { Suspense, useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import HeaderTeacher from '@/app/_components/Header/HeaderTeacher'
import FlowbiteClient from '@/app/_components/Flowbite/FlowbiteClient';
import Loading from './loading';


export default function DashboardLayout({
  children,
}: any) {


  return (
    <section className="">
      <HeaderTeacher />
      <div className='flex justify-end mt-[70px] '>
        <Sidebar />
        <div className="px-4 py-7 w-[calc(100%-254px)] min-h-svh bg-[#fbfbfd] pb-5">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </div>
      </div>
      <FlowbiteClient />
    </section>
  )
}
