import { FormWrapper } from "./FormWrapper"

export function ContentForm({
    register,
    errors
}: any) {
    return (
        <FormWrapper title="">
            <div>
                <h2 className="text-[#171347] font-bold section-title text-lg">Nội dung</h2>
                <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Thêm mục</button>
                <div className="mt-3">
                    <div className="">
                        <ul>
                            <li className="bg-white py-[30px] px-[20px] rounded-xl">
                                <div className="flex justify-center items-center">

                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </FormWrapper>
    )
}