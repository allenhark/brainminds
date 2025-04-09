import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HelmetComponent from "../components/HelmetComponent";

export default function FaqPage() {
    return (
        <div className="flex flex-col justify-center items-center">
            <HelmetComponent
                title="常见问题 - Frequently Asked Questions | 学习English"
                description="查找有关我们英语家教服务的常见问题和解答。Find answers to frequently asked questions about our English tutoring services."
                keywords="英语家教, English tutors, 常见问题, FAQ, 英语课程, English lessons"
                ogTitle="常见问题 - Frequently Asked Questions"
                ogDescription="查找有关我们英语家教服务的常见问题和解答。"
            />
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white min-h-[300px] w-full -mt-[70px]">
                <div className="container max-w-4xl mx-auto px-4 pb-8 relative pt-[150px]">
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                            <span className="block text-red-500">常见问题</span>
                            <span className="block mt-2 text-gray-700">Frequently Asked Questions</span>
                        </h1>
                        <p className="text-gray-600 text-center max-w-2xl mx-auto">
                            以下是关于我们英语辅导服务的常见问题和解答。如果您的问题未得到解答，请随时联系我们的客服团队。
                        </p>
                        <p className="text-gray-500 text-center max-w-2xl mx-auto mt-2">
                            Below are frequently asked questions about our English tutoring services. If your question isn't answered, feel free to contact our support team.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-12 w-full">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="space-y-8">

                        {/* Tutoring */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">
                                <span className="text-red-500">关于辅导</span>
                                <span className="ml-2 text-gray-700">About Tutoring</span>
                            </h2>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                                        如何选择合适的英语老师？
                                    </h3>
                                    <p className="text-gray-700 mb-2">
                                        选择合适的老师应考虑以下因素：您的学习目标、老师的专业背景、教学经验和教学风格。您可以浏览老师的个人资料，查看评价和教学视频，还可以预约免费的体验课。
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        When choosing the right tutor, consider: your learning goals, the tutor's professional background, teaching experience, and teaching style. You can browse tutor profiles, read reviews, watch teaching videos, and book a free trial lesson.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                                        第一次课程是怎样的？
                                    </h3>
                                    <p className="text-gray-700 mb-2">
                                        第一次课程通常包括双方的自我介绍、对您英语水平和需求的评估、制定个性化学习计划，以及简短的教学示范。这是您和老师互相了解的良好机会。
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        The first lesson typically includes introductions, an assessment of your English level and needs, creating a personalized learning plan, and a brief teaching demonstration. It's a great opportunity for you and the tutor to get to know each other.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                                        需要准备什么材料？
                                    </h3>
                                    <p className="text-gray-700 mb-2">
                                        您只需准备一个稳定的网络连接、电脑或平板电脑（带摄像头和麦克风）以及笔记本。老师会根据您的需求提供学习材料，或者您也可以使用自己的教材。
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        You only need a stable internet connection, a computer or tablet (with camera and microphone), and a notebook. Your tutor will provide learning materials based on your needs, or you can use your own textbooks.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payments */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">
                                <span className="text-red-500">关于支付</span>
                                <span className="ml-2 text-gray-700">About Payments</span>
                            </h2>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                                        如何支付课程费用？
                                    </h3>
                                    <p className="text-gray-700 mb-2">
                                        我们接受多种支付方式，包括信用卡、微信支付、支付宝和银行转账。您可以选择单次付款或购买课程套餐，套餐通常会有优惠。
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        We accept various payment methods, including credit cards, WeChat Pay, Alipay, and bank transfers. You can choose to pay per lesson or purchase a lesson package, which typically offers discounts.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                                        可以退款吗？
                                    </h3>
                                    <p className="text-gray-700 mb-2">
                                        如果您提前24小时取消课程，可以获得全额退款或重新安排课程。如果您购买了课程套餐但尚未使用，您可以根据我们的退款政策获得未使用课程的部分退款。
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        If you cancel a lesson 24 hours in advance, you can receive a full refund or reschedule. If you've purchased a lesson package but haven't used it, you may receive a partial refund for unused lessons according to our refund policy.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Technical */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">
                                <span className="text-red-500">技术问题</span>
                                <span className="ml-2 text-gray-700">Technical Issues</span>
                            </h2>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                                        在线课程使用什么平台？
                                    </h3>
                                    <p className="text-gray-700 mb-2">
                                        我们的在线课程主要使用Zoom或腾讯会议。两个平台都支持屏幕共享、白板和聊天功能，满足在线教学的需求。您的老师会在课前发送课程链接。
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Our online lessons primarily use Zoom or Tencent Meeting. Both platforms support screen sharing, whiteboard, and chat features to meet online teaching needs. Your tutor will send you the lesson link before class.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                                        遇到技术问题怎么办？
                                    </h3>
                                    <p className="text-gray-700 mb-2">
                                        如果您在课程前或课程中遇到技术问题，请联系我们的技术支持团队。您可以通过在线聊天、电子邮件或电话获得帮助。我们也提供常见技术问题的解决指南。
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        If you encounter technical issues before or during a lesson, please contact our technical support team. You can get help via live chat, email, or phone. We also provide guides for resolving common technical issues.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Us Section */}
                    <div className="mt-12 p-8 bg-red-50 rounded-2xl text-center">
                        <h2 className="text-xl font-bold mb-4">
                            <span className="text-red-500">还有其他问题？</span>
                            <span className="ml-2 text-gray-700">Still have questions?</span>
                        </h2>
                        <p className="text-gray-700 mb-6">
                            如果您的问题未在上面列出，请随时联系我们的客服团队，我们很乐意为您提供帮助。
                        </p>
                        <Link to="/contact">
                            <Button className="bg-red-500 text-white hover:bg-red-600">
                                联系我们 Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
} 