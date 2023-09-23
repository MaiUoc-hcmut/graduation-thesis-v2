/* eslint-disable react/jsx-key */
import { FormEvent, useEffect, useState } from "react"
import { useMultistepForm } from "./UseMultiStep"
import { OverviewForm } from "../forms/create_course/OverviewForm"
import { IntroduceForm } from "../forms/create_course/IntroduceForm";
import { PriceForm } from "../forms/create_course/PriceForm";
import { TimeForm } from "../forms/create_course/TimeForm";
import parse from 'html-react-parser';


type FormData = {
    target: string
    object: string
    method: string
    title: string
}

const INITIAL_DATA: FormData = {
    target: "",
    object: "",
    method: "",
    title: "",
}

export default function CreateCourseStep() {
    const styleCom = 'w-full p-4 text-green-700 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400'
    const styleInit = 'w-full p-4 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
    const stylePre = 'w-full p-4 text-blue-700 bg-blue-100 border border-blue-300 rounded-lg dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400'
    const iconPre = `<svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
</svg>`
    const iconCom = `<svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
</svg>`
    const [data, setData] = useState(INITIAL_DATA)

    function setStyle(step: number) {
        return currentStepIndex + 1 == step ? stylePre : (currentStepIndex + 1 > step ? styleCom : styleInit)
    }
    function setIcon(step: number) {
        return currentStepIndex + 1 == step ? iconPre : (currentStepIndex + 1 > step ? iconCom : '')
    }

    function updateFields(fields: Partial<FormData>) {
        setData(prev => {
            return { ...prev, ...fields }
        })
    }
    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
        useMultistepForm([
            <IntroduceForm {...data} updateFields={updateFields} />,
            <OverviewForm {...data} updateFields={updateFields} />,
            <PriceForm {...data} updateFields={updateFields} />,
            <TimeForm {...data} updateFields={updateFields} />,
        ])


    function onSubmit(e: FormEvent) {
        e.preventDefault()
        if (!isLastStep) return next()
        alert("Successful Account Creation")
    }

    return (
        <div className="p-5 bg-white shadow-lg">

            <h3 className="text-center font-semibold text-2xl pb-5">Tạo khóa học</h3>
            <hr className="py-5" />

            <div className="flex flex-row mx-5">
                <div className="mr-10">
                    <ol className="space-y-4 w-72">
                        <li>
                            <div className={setStyle(1)} role="alert">
                                <div className="flex items-center justify-between">
                                    <span className="sr-only">Giới thiệu</span>
                                    <h3 className="font-medium">Bước 1: Giới thiệu</h3>
                                    {parse(setIcon(1))}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={setStyle(2)} role="alert">
                                <div className="flex items-center justify-between">
                                    <span className="sr-only">Tổng quan</span>
                                    <h3 className="font-medium">Bước 2: Tổng quan</h3>
                                    {parse(setIcon(2))}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={setStyle(3)} role="alert">
                                <div className="flex items-center justify-between">
                                    <span className="sr-only">Định giá & Khuyến mãi</span>
                                    <h3 className="font-medium">Bước 3: Định giá & Khuyến mãi</h3>
                                    {parse(setIcon(3))}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={setStyle(4)} role="alert">
                                <div className="flex items-center justify-between">
                                    <span className="sr-only">Thời gian phù hợp</span>
                                    <h3 className="font-medium">Bước 4: Thời gian phù hợp</h3>
                                    {parse(setIcon(4))}
                                </div>
                            </div>
                        </li>
                    </ol>
                </div>
                <form onSubmit={onSubmit} className="flex-1">
                    {step}
                    <div className="flex flex-row justify-between my-10">
                        {!isFirstStep && (
                            <button className="text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-600 dark:border-gray-600" type="button" onClick={back}>
                                Back
                            </button>
                        )}
                        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">{isLastStep ? "Finish" : "Next"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
