"use client"

import SidebarTeacher from '@/app/_components/Sidebar/SidebarTeacher'
import SidebarStudent from '@/app/_components/Sidebar/SidebarStudent';
import { Suspense, useEffect } from 'react'
import HeaderTeacher from '@/app/_components/Header/HeaderTeacher'
import HeaderStudent from '@/app/_components/Header/HeaderStudent';
import FlowbiteClient from '@/app/_components/Flowbite/FlowbiteClient';
import Loading from './loading';
import { useAppSelector } from "@/redux/store";

export default function DashboardLayout({
  children,
}: any) {
  const { user } = useAppSelector(state => state.authReducer);

  return (
    <section className="">
      {
        user?.role == "teacher" ? <HeaderTeacher /> : <HeaderStudent />
      }

      <div className='flex justify-end mt-[70px] '>
        {
          user?.role == "teacher" ? <SidebarTeacher /> : <SidebarStudent />
        }
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
