import Image from "next/image";

export default function IntroExam() {
    return (
        <div className="flex flex-col items-center space-y-4 p-10 h-150">
            <div className="w-full h-10 flex items-center justify-center mt-10 mb-20">
                <p 
                    className="text-center text-4xl font-bold"
                    style={{color: '#1DB8FB'}}
                >
                    Đề thi tổng quát
                </p>
            </div>

            <div className="w-full flex justify-between px-40">
                <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center w-40 h-40 rounded-3xl bg-green-500 transform rotate-45">
                        <Image 
                            src='/contentIntroExam.png'
                            alt="Image inside first"
                            width={90}
                            height={90}
                            className="absolute object-cover transform -rotate-45"
                        />
                    </div>
                    <p className="text-center mt-10 font-bold text-2xl">
                        Đa dạng nội dung
                    </p>
                    <p className="w-60 text-center mt-2">
                        Cung cấp đa dạng nội dụng các câu hỏi
                        trắc nghiệm thuộc nhiều lĩnh vực khác nhau
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center w-40 h-40 rounded-3xl bg-green-500 transform rotate-45">
                        <Image 
                            src='/solutionIntroExam.png'
                            alt="Image inside first"
                            width={90}
                            height={90}
                            className="absolute object-cover transform -rotate-45"
                        />
                    </div>
                    <p className="text-center mt-10 font-bold text-2xl">
                        Đáp án chi tiết
                    </p>
                    <p className="w-60 text-center mt-2">
                        Sau khi hoàn thành bài kiểm tra trắc nghiệm 
                        hệ thống sẽ thông báo số điểm đạt được kèm lời giải chi tiết
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center w-40 h-40 rounded-3xl bg-green-500 transform rotate-45">
                        <Image 
                            src='/suggestIntroExam.png'
                            alt="Image inside first"
                            width={90}
                            height={90}
                            className="absolute object-cover transform -rotate-45"
                        />
                    </div>
                    <p className="text-center mt-10 font-bold text-2xl">
                        Gợi ý câu hỏi
                    </p>
                    <p className="w-60 text-center mt-2">
                        Hệ thống sẽ dựa vào câu hỏi bạn làm sai 
                        tìm ra dạng câu hỏi để đưa ra câu hỏi gợi 
                        ý giúp bạn ôn tập lại
                    </p>
                </div>
            </div>
        </div>

    )
}