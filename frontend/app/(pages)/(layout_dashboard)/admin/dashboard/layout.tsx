"use client"

import SidebarTeacher from '@/app/_components/Sidebar/SidebarTeacher'
import SidebarStudent from '@/app/_components/Sidebar/SidebarStudent';
import { Suspense, useEffect } from 'react'
import HeaderTeacher from '@/app/_components/Header/HeaderTeacher'
import HeaderStudent from '@/app/_components/Header/HeaderStudent';
import FlowbiteClient from '@/app/_components/Flowbite/FlowbiteClient';
import Loading from '../../loading';
import { useAppSelector } from "@/redux/store";
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function DashboardTeacherLayout({
  children,
}: any) {
  const { user, accessToken } = useAppSelector(state => state.authReducer);
  if (user.id == 0) redirect('/login')
  return (
    user?.role != "teacher" ? <div className='h-svh w-full flex justify-center items-center text-xl'> <p className='mr-2'>Bạn không có quyền truy cập vào trang này.</p> <Link className='underline text-blue-500' href="/">Quay lại</Link></div> :
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
