'use client'
import Intro from '@/components/home/intro';
import IntroCourse from '@/components/home/introCourse';
import IntroExam from '@/components/home/introExam';
import Pround from '@/components/home/pround';
import Footer from '@/components/Footer';

export default function Page() {
    return (
        <div>
            <Intro />
            <IntroCourse />
            <IntroExam />
            <Pround />
            <Footer />
        </div>
    )
}