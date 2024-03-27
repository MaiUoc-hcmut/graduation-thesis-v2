

import FlowbiteClient from '@/app/_components/Flowbite/FlowbiteClient';
import Footer from '@/app/_components/Footer/footer';
import HeaderStudent from '@/app/_components/Header/HeaderStudent'
import { Suspense } from 'react'
import 'react-toastify/dist/ReactToastify.css';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <section className="">
      <HeaderStudent />
      <Suspense fallback={<p>Loading data...</p>}>
        <div className='mt-20'>
          {children}
        </div>
      </Suspense>
      <Footer />
      <FlowbiteClient />

    </section>
  )
}
