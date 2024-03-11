import { Suspense } from 'react'
import { HeaderLearning } from '@/app/_components/Header/HeaderLearning'
export default function LearninngLayout({
    children,
    params,
}: {
    children: React.ReactNode,
    params: any
}) {

    return (
        <section className="">
            <HeaderLearning params={params} />
            <div className='mt-24'>
                <Suspense fallback={<p>Loading data...</p>}>
                    {children}
                </Suspense>

            </div>
        </section>
    )
}
