import { FormWrapper } from "../FormWrapper"

type TimeData = {

}

type TimeFormProps = TimeData & {
    updateFields: (fields: Partial<TimeData>) => void
}

export function TimeForm({
    updateFields,
}: TimeFormProps) {
    return (
        <FormWrapper title="">
            <div className="mb-5">
                <h4 className="font-medium text-xl">Thời gian phù hợp</h4>
                <p className="my-2">Hãy cho học sinh biết thời gian phù hợp nhất để đăng ký và hoàn thành khóa học, ngoài ra còn
                    là khoảng thời gian nên dành ra để học.
                    <br />
                    Điều này sẽ giúp khóa học của bạn trở nên có ích hơn đối với học sinh.</p>
            </div>
            <div className="mb-5">
                <p className="text-base font-medium">Thời gian hoàn thành khóa học</p>
                <p className="my-2">Là thời gian phù hợp để hoàn thành khóa học tùy theo mục tiêu mà bạn đã đề ra cho khóa học.
                    Mốc thời gian không cần quá chính xác, nhưng hãy đảm bảo nó giúp ích cho học sinh khi đăng
                    ký khóa học của bạn.</p>
                <div className="relative max-w-sm">
                    <input type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Chọn ngày" />
                </div>

            </div>
            <div className="mb-5">
                <p className="text-base font-medium">Thời gian dành cho khóa học</p>
                <p className="my-2">Là khoảng thời gian mà học sinh dành ra để học khóa học của bạn. Bạn cần ước tính thời gian
                    phù hợp để giúp học sinh kiểm soát tiến độ khi học khóa học của bạn.</p>
                <div className="relative max-w-sm">
                    <input type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Chọn ngày" />
                </div>
            </div>
        </FormWrapper>
    )
}