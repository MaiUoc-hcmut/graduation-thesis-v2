"use client"

/* eslint-disable react/jsx-no-undef */
import { ArrowsPointingOutIcon, EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Label, TextInput, Modal } from 'flowbite-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Dropdown } from 'flowbite-react';
import { AnswerCard } from "./AnswerCard";
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { useState } from "react";
import Image from "next/image";
import parse from 'html-react-parser';
import CustomCKEditor from "../../Editor/CKEditor";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

export const QuestionCard = ({ hanldeForm, indexQuestion, provided, question, removeQuestion, modal, setModal, image, setImage, change, setChange }: any) => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        setError,
        clearErrors,
        formState: { errors },
    } = hanldeForm
    const [files, setFiles] = useState([])
    return (
        <div className='mb-5 border-[1px] border-[#ececec] bg-white p-5 rounded-xl flex justify-between items-center' ref={provided.innerRef} {...provided.draggableProps}>
            <>
                <Modal show={modal[`edit_question_${question.id}`]} size="3xl" onClose={() => setModal({ ...modal, [`edit_question_${question.id}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={handleSubmit((data: any) => {

                            if (data.questions[indexQuestion].modify != "create") {
                                setValue(`questions.${indexQuestion}.modify`, "change")
                            }

                            const hasCorrectAnswer = getValues().questions[indexQuestion].answers.some((answer: any) => answer.is_correct);

                            if (!hasCorrectAnswer) {
                                // Đặt lỗi nếu không có đáp án nào được chọn là đáp án đúng
                                setError(`questions.${indexQuestion}` as const, {
                                    type: "manual",
                                    message: "Câu hỏi cần ít nhất một đáp án đúng"
                                });
                                return;
                            }
                            else {
                                clearErrors(`questions.${indexQuestion}`);
                            }
                            setChange(!change)
                            setValue(`questions.${indexQuestion}.modify`, "change")
                            setModal({ ...modal, [`edit_question_${question.id}`]: false })
                        }, (errors: any) => {
                            const hasCorrectAnswer = getValues().questions[indexQuestion].answers.some((answer: any) => answer.is_correct);

                            if (hasCorrectAnswer) {
                                clearErrors(`questions.${indexQuestion}`);
                            }
                            if (!(Object.entries(errors).length === 0)) {
                                setChange(!change)
                                setValue(`questions.${indexQuestion}.modify`, "change")
                                setModal({ ...modal, [`edit_question_${question.id}`]: false })
                            }
                        })}>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sửa câu hỏi</h3>


                            <div>
                                <div className="mb-5">
                                    <div className="mb-2 block">
                                        <Label htmlFor="email" value="Tiêu đề câu hỏi" />
                                    </div>
                                    <CustomCKEditor className="h-30" setValue={setValue} value={`${getValues().questions[indexQuestion].content_text}`} position={`questions.${indexQuestion}.content_text`} />
                                    <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.questions?.[indexQuestion]?.content_text?.message}
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <div className="mb-2 block">
                                        <Label htmlFor="email" value="Ảnh (tùy chọn)" />
                                    </div>

                                    <FilePond
                                        files={files}
                                        onupdatefiles={() => setFiles}
                                        acceptedFileTypes={['image/*']}

                                        server={{
                                            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                                const formData = new FormData();
                                                formData.append(fieldName, file, file.name);
                                                formData.append('data', JSON.stringify({
                                                    id_question: question.id,
                                                    type: "question"
                                                }));


                                                const request = new XMLHttpRequest();
                                                request.open('POST', 'http://localhost:4002/api/v1/images')


                                                request.upload.onprogress = (e) => {
                                                    progress(e.lengthComputable, e.loaded, e.total);
                                                };

                                                request.onload = function (res: any) {

                                                    if (request.status >= 200 && request.status < 300) {
                                                        // the load method accepts either a string (id) or an object
                                                        setImage({ ...image, [question.id]: JSON.parse(request.response).url });

                                                        load(request.responseText);
                                                    } else {
                                                        // Can call the error method if something is wrong, should exit after
                                                        error('oh no');
                                                    }
                                                };
                                                request.send(formData)

                                                // courseApi.uploadVideo(formData)
                                            },

                                        }
                                        }

                                        name="image"
                                        labelIdle='Kéo & thả hoặc <span class="filepond--label-action">Tìm kiếm</span>'
                                    />
                                    {
                                        image[question.id] || question.content_image ? <div className="w-full h-[240px] relative">
                                            <Image
                                                src={`${image[question.id] || question.content_image}`}
                                                fill={true}
                                                className='w-full h-full absolute top-0 left-0 overflow-hidden object-cover object-center'
                                                alt="logo"
                                            />
                                        </div>
                                            : null
                                    }
                                    <div>

                                    </div>

                                </div>
                                <div className="mb-5">
                                    <div className="mb-2 block">
                                        <Label htmlFor="email" value="Giải thích" />
                                    </div>

                                    <CustomCKEditor className="h-50" setValue={setValue} value="" position={`questions.${indexQuestion}.explain`} />
                                    <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors?.questions?.[indexQuestion]?.explain?.message}
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <div className="flex-1 flex items-center justify-end">
                                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Câu hỏi có nhiều đáp án đúng</label>
                                        <input  {...register(`questions.${indexQuestion}.multi_choice`)} id="default-checkbox" type="checkbox" className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    </div>

                                </div>

                                <AnswerCard hanldeForm={hanldeForm} question={question} indexQuestion={indexQuestion} image={image} setImage={setImage} change={change} setChange={setChange} />
                                <div className="text-sm text-red-600 dark:text-red-500">
                                    {errors?.questions?.[indexQuestion]?.message}
                                </div>
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
                        if (question.mofify == "create") {
                            removeQuestion(indexQuestion)
                        }
                        else {

                            setValue(`questions.${indexQuestion}.modify`, "delete")
                        }
                        setChange(!change)
                    }}>Xóa</p></Dropdown.Item>
                </Dropdown>

            </div>
        </div>

    )
}
