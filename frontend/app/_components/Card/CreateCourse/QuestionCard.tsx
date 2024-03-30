import { ArrowsPointingOutIcon, EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Label, TextInput, Modal } from 'flowbite-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Dropdown } from 'flowbite-react';
import { AnswerCard } from "./AnswerCard";
import CustomCKEditor from "../../Editor/CKEditor";
import parse from 'html-react-parser';

export const QuestionCard = ({ indexChapter, indexTopic, hanldeForm, indexQuestion, provided, question, removeQuestion, modal, setModal, topic }: any) => {
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = hanldeForm
    return (
        <div className='mb-5 border-[1px] border-[#ececec] bg-white p-5 rounded-xl flex justify-between items-center' ref={provided.innerRef} {...provided.draggableProps}>
            <>
                <Modal show={modal[`edit_question_${question.id}`]} size="3xl" onClose={() => setModal({ ...modal, [`edit_question_${question.id}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={handleSubmit(async (data1: any) => {
                            if (!(Object.entries(errors).length === 0)) return
                            setModal({ ...modal, [`edit_question_${question.id}`]: false })
                        })}>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thêm câu hỏi</h3>


                            <div>
                                <div className="mb-5">
                                    <div className="mb-2 block">
                                        <Label htmlFor="email" value="Nội dung câu hỏi" />
                                    </div>

                                    <CustomCKEditor className="h-50" setValue={setValue} value={question.content_text} position={`chapters.${indexChapter}.topics.${indexTopic}.questions.${indexQuestion}.content_text`} />
                                    <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors?.chapters?.[indexChapter]?.topics?.[indexTopic]?.questions?.[indexQuestion]?.content_text?.message}
                                    </div>
                                </div>
                                <AnswerCard indexChapter={indexChapter} indexTopic={indexTopic} hanldeForm={hanldeForm} indexQuestion={indexQuestion} question={question} setModal={setModal} modal={modal} topic={topic} />
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setModal({ ...modal, [`edit_question_${question.id}`]: false })
                                    }
                                    }
                                    type="button"
                                    className="mr-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    Hủy
                                </button>
                                <div>
                                    <button
                                        type="submit"
                                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>

            <h4 className='text-[#171347] font-semibold'>
                {parse(question.content_text)}
            </h4>
            <div className='flex'>
                <div className='flex justify-center items-center'  {...provided.dragHandleProps} >
                    <button type="button" className="mr-[10px] text-[#a4c4fa]" style={{
                    }} >
                        <ArrowsPointingOutIcon className="w-6 h-6" />
                    </button>
                </div>
                <Dropdown className='cursor-pointer' label="" renderTrigger={() => <EllipsisVerticalIcon className="w-6 h-6" />} placement="left">
                    <Dropdown.Item onClick={() => {

                    }}>
                        <p onClick={() => setModal({ ...modal, [`edit_question_${question.id}`]: true })}>
                            Sửa
                        </p>
                    </Dropdown.Item>
                    <Dropdown.Item><p className="text-red-600" onClick={() => {
                        removeQuestion(indexQuestion)
                    }}>Xóa</p></Dropdown.Item>
                </Dropdown>

            </div>
        </div>

    )
}
