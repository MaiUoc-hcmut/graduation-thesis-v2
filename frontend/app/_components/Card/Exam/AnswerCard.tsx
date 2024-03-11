import { XMarkIcon } from "@heroicons/react/24/outline"
import { Label, TextInput } from 'flowbite-react';
import { useFieldArray } from 'react-hook-form';


export const AnswerCard = ({ hanldeForm, indexQuestion }: any) => {

    const {
        register,
        control,
        formState: { errors },
    } = hanldeForm

    const { fields: fieldsAnswer, append: appendAnswer, remove: removeAnswer } = useFieldArray({
        control,
        name: `questions.${indexQuestion}.answers`
    });

    return (
        <div className='mt-5'>
            <h2 className="text-[#171347] font-bold section-title flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">Câu trả lời</h2>
            <button type="button" onClick={() => {
                appendAnswer({
                    content_text: "",
                    isCorrect: false,
                })

            }}
                className="mt-3 bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover">
                Thêm câu trả lời
            </button>
            <div className='mt-8'>
                {fieldsAnswer?.map((field: any, indexAnswer: any) => {
                    return (
                        <div key={field.id} className='relative border-[1px] border-[#ececec] p-3 rounded-[10px] mb-10'>
                            <div className='mb-5'>
                                <div className="mb-2 block">
                                    <Label htmlFor="title" value="Tiêu đề câu trả lời" />
                                </div>
                                <TextInput
                                    type="text"
                                    {...register(`questions.${indexQuestion}.answers.${indexAnswer}.content_text`, {
                                        required: `Tiêu đề câu trả lời không thể thiếu.`
                                    })}
                                />
                                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.questions?.[indexQuestion]?.answers?.[indexAnswer]?.content_text?.message}
                                </div>
                            </div>
                            <div className='flex justify-between items-end mb-2'>
                                <div className='w-2/3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="small_size">Câu trả lời hình ảnh (tùy chọn)</label>
                                    <input className="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="small_size" type="file" />
                                </div>
                                <div className="flex-1 flex items-center justify-end">
                                    <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2">Câu trả lời đúng</label>
                                    <input  {...register(`questions.${indexQuestion}.answers.${indexAnswer}.isCorrect`)} id="default-checkbox" type="checkbox" className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            <button onClick={() => removeAnswer(indexAnswer)} className='w-8 h-8 flex justify-center items-center rounded-full bg-[#f63c3c] absolute right-2 top-[-16px]'>
                                <XMarkIcon className='w-5 h-5 text-white' />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>

    )
}
