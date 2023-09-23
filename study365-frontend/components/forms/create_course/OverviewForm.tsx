import { FormWrapper } from "../FormWrapper"

type OverviewData = {
    target: string
    object: string
    method: string
}

type OverviewFormProps = OverviewData & {
    updateFields: (fields: Partial<OverviewData>) => void
}

export function OverviewForm({
    target,
    object,
    method,
    updateFields,
}: OverviewFormProps) {
    return (
        <FormWrapper title="">
            <h4 className="font-medium text-xl">Tổng quan khóa học</h4>
            <p className="my-5">Những thông tin bạn điền dưới đây sẽ được hiển thị công khai khi khóa học của bạn được
                phê duyệt. Điều này giúp học sinh xác định xem liệu khóa học có phù hợp hay không, đồng
                thời nó sẽ ảnh hưởng đến lượng tương tác đối với khóa học của bạn.</p>
            <div className="mb-5">
                <p className="text-base font-medium">Mục tiêu của khóa học là gì?</p>
                <p className="mt-2">Nhập ít nhất một mục tiêu cho khóa học của bạn.</p>
                <textarea id="message" value={target} required className="block mt-3 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ví dụ: Giúp học sinh nắm vững kiến thức toán giải tích và hình học 12" onChange={e => updateFields({ target: e.target.value })}></textarea>
            </div>
            <div className="mb-5">
                <p className="text-base font-medium">Đối tượng của khóa học là gì?</p>
                <p className="mt-2">Nhập ít nhất một đối tượng cho khóa học của bạn.</p>
                <textarea id="message" value={object} required className="block mt-3 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ví dụ: Giúp học sinh nắm vững kiến thức toán giải tích và hình học 12" onChange={e => updateFields({ object: e.target.value })}></textarea>
            </div>
            <div className="mb-5">
                <p className="text-base font-medium">Phương pháp nào được sử dụng trong khóa học?</p>
                <p className="mt-2">Nhập ít nhất một mục tiêu cho khóa học của bạn.</p>
                <textarea id="message" value={method} required className="block mt-3 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ví dụ: Giúp học sinh nắm vững kiến thức toán giải tích và hình học 12" onChange={e => updateFields({ method: e.target.value })}></textarea>
            </div>



        </FormWrapper>
    )
}