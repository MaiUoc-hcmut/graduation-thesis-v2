

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
      {/* <HeaderStudent /> */}
      <Suspense fallback={<p>Loading data...</p>}>
        {children}
      </Suspense>
      {/* <Footer /> */}
    </section>
  )
}
