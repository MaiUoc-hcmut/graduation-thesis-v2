import { FormWrapper } from "../FormWrapper"

type PriceData = {

}

type PriceFormProps = PriceData & {
    updateFields: (fields: Partial<PriceData>) => void
}

export function PriceForm({
    updateFields,
}: PriceFormProps) {
    return (
        <FormWrapper title="">
            <div className="mb-5">
                <h4 className="font-medium text-xl">Định giá</h4>
                <p className="my-2">Học sinh sẽ nhìn thấy giá niêm yết khi khóa học
                    được xét duyệt thành công.
                    <br />
                    Lưu ý: Giá khóa học sẽ theo các bậc giá cố định đã được định sẵn.</p>
                <input type="number" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="VNĐ" required />
            </div>
            <div className="mb-5">
                <h4 className="font-medium text-xl">Khuyến mãi</h4>
                <p className="my-2">Tạo coupon cho các khóa họ của bạn giúp thu hút học sinh đăng ký khóa học, qua đó giúp khóa
                    học của bạn trở nên phổ biến hơn.
                    <br />
                    Bạn có thể tạo nhiều coupon cho mỗi khóa học, tuy nhiên, học sinh sẽ chỉ được áp dụng một coupon
                    cho một khóa học.
                    <br />
                    Lưu ý: Bạn không thể tạo coupon cho khóa học miễn phí</p>
                <div>
                    <div className="mb-2">
                        <label htmlFor="name_coupon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên khuyến mãi</label>
                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="back to school" />
                    </div>
                    <div>
                        <label htmlFor="code_coupon" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mã khuyến mãi</label>
                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="x1dfđf5" />
                    </div>
                </div>
            </div>
        </FormWrapper>
    )
}