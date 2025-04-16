import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HelmetComponent from "../components/HelmetComponent";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function PricingPage() {
    const navigate = useNavigate();
    const wechatId = "https://u.wechat.com/kDAHPYlSKR_Ae9fr_iygEOY?s=2";
    const alipayId = "https://u.wechat.com/kDAHPYlSKR_Ae9fr_iygEOY?s=2"; // Replace with actual Alipay ID when available

    return (
        <div className="flex flex-col justify-center items-center">
            <HelmetComponent
                title="学习计划 - Learning Plans | 学习English"
                description="Choose from our flexible learning plans designed to help you achieve your English learning goals with native tutors."
            />
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white w-full -mt-[70px]">
                <div className="container max-w-6xl mx-auto px-4 pb-24 relative pt-[120px]">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
                            灵活的学习计划
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                            学习计划
                            <span className="block mt-3">Learning Plan</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            开启您的英语学习之旅
                            <span className="block mt-2">Embark on your transformative English learning journey with our comprehensive program</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Card */}
            <section className="py-16 w-full -mt-16">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="max-w-xl mx-auto">
                        {/* Standard Plan */}
                        <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-red-500 transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                                        标准课程 Standard Course
                                        <span className="block text-2xl mt-1">全方位英语学习 Comprehensive English Learning</span>
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-5xl font-bold text-red-600">¥13,000</p>
                                    <p className="text-gray-500 mt-1">每月 per month</p>
                                </div>
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-red-200 to-transparent my-8"></div>
                            <ul className="space-y-5 mb-10">
                                {[
                                    "个性化学习路径，根据您的目标定制 Personalized learning path tailored to your goals",
                                    "灵活的时间安排，适应您的生活方式 Flexible scheduling to fit your lifestyle",
                                    "全面的进度跟踪和分析 Comprehensive progress tracking and analytics",
                                    "优质学习材料和资源 Premium learning materials and resources",
                                    "24/7在线学习平台访问 24/7 access to online study platform",
                                    "具有TEFL认证的母语教师 Native speaking teachers with TEFL certification"
                                ].map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <i className="fas fa-check text-green-500 flex-shrink-0 mt-1"></i>
                                        <span className="text-gray-700 text-lg">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => {
                                    navigate('/login');
                                }}
                            >
                                选择计划 Choose Plan
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Methods */}
            <section className="py-16 w-full bg-gradient-to-b from-gray-50 to-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="block text-red-500">联系我们 Contact Us</span>
                        <span className="block text-xl mt-2 text-gray-600">扫描二维码添加客服微信 Scan QR code to add customer service</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* WeChat */}
                        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <i className="fab fa-weixin text-3xl text-green-600"></i>
                                </div>
                                <h3 className="font-bold text-xl text-gray-800">微信联系 WeChat Contact</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                扫描二维码添加客服微信，了解更多课程详情和支付方式
                                <span className="block mt-1">Scan QR code to add our customer service on WeChat for more course details and payment options</span>
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                                <div className="w-48 h-48 bg-white p-2 rounded">
                                    <QRCodeSVG
                                        value={wechatId}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-2">
                                扫描二维码添加客服微信
                                <span className="block">Scan QR code to add customer service on WeChat</span>
                            </p>
                        </div>

                        {/* Alipay */}
                        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <i className="fab fa-alipay text-3xl text-blue-600"></i>
                                </div>
                                <h3 className="font-bold text-xl text-gray-800">支付宝支付 Alipay Payment</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                添加客服微信后，我们将提供支付宝支付链接
                                <span className="block mt-1">After adding our WeChat, we will provide you with the Alipay payment link</span>
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                                <div className="w-48 h-48 bg-white p-2 rounded">
                                    <QRCodeSVG
                                        value={alipayId}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-2">
                                扫描二维码添加客服微信
                                <span className="block">Scan QR code to add customer service on WeChat</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 w-full bg-gradient-to-b from-gray-50 to-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12 text-center">
                        <span className="block text-red-500">常见问题 Frequently Asked Questions</span>
                        <span className="block text-xl mt-3 text-gray-600">关于课程和付费的常见问题 Common questions about courses and payments</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                title: "如何支付？\nHow can I pay?",
                                content: "支持微信支付和支付宝\nWe accept WeChat Pay and Alipay"
                            },
                            {
                                title: "可以分期付款吗？\nCan I pay in installments?",
                                content: "是的，我们提供3-12个月的分期付款选项\nYes, we offer 3-12 month installment plans"
                            },
                            {
                                title: "退款政策是什么？\nWhat's the refund policy?",
                                content: "7天内可全额退款，之后按剩余课时比例退款\nFull refund within 7 days, prorated refund afterwards"
                            },
                            {
                                title: "课程有效期多久？\nHow long are courses valid?",
                                content: "课程6个月内有效\nCourses are valid for 6 months"
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <h3 className="font-bold text-xl mb-4 text-gray-800">{faq.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{faq.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}