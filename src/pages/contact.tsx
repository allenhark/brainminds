import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import HelmetComponent from "../components/HelmetComponent";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (value: string) => {
        setFormData(prev => ({ ...prev, subject: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "general",
                message: "",
            });
        }, 1000);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <HelmetComponent
                title="联系我们 - Contact Us | 学习English"
                description="联系我们的客服团队，获取关于英语学习和辅导服务的帮助。Contact our customer service team for help with English learning and tutoring services."
                keywords="联系我们, contact us, 英语辅导, English tutoring, 客户支持, customer support"
                ogTitle="联系我们 - Contact Us"
                ogDescription="联系我们的客服团队，获取关于英语学习和辅导服务的帮助。"
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-red-50 via-red-50/50 to-white min-h-[300px] w-full -mt-[70px]">
                <div className="container max-w-4xl mx-auto px-4 pb-8 relative pt-[150px]">
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                            <span className="block text-red-500">联系我们</span>
                            <span className="block mt-2 text-gray-700">Contact Us</span>
                        </h1>
                        <p className="text-gray-600 text-center max-w-2xl mx-auto">
                            我们的客服团队随时为您提供帮助。无论您有任何问题、建议或反馈，都可以通过以下方式联系我们。
                        </p>
                        <p className="text-gray-500 text-center max-w-2xl mx-auto mt-2">
                            Our support team is here to help. Whether you have questions, suggestions, or feedback, you can reach us through the following channels.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-12 w-full">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                                <i className="fas fa-phone text-xl"></i>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block">电话联系</span>
                                <span className="block text-sm text-gray-500">Phone</span>
                            </h3>
                            <p className="text-gray-700">
                                +86 400-123-4567
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                周一至周五: 9:00 - 18:00<br />
                                周末: 10:00 - 16:00
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                                <i className="fas fa-envelope text-xl"></i>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block">电子邮件</span>
                                <span className="block text-sm text-gray-500">Email</span>
                            </h3>
                            <p className="text-gray-700">
                                info@learnenglish.com
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                通常在24小时内回复<br />
                                We usually respond within 24 hours
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                                <i className="fas fa-map-marker-alt text-xl"></i>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                <span className="block">地址</span>
                                <span className="block text-sm text-gray-500">Address</span>
                            </h3>
                            <p className="text-gray-700">
                                中国上海市浦东新区张江高科技园区
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Zhangjiang Hi-Tech Park,<br />
                                Pudong, Shanghai, China
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">
                            <span className="text-red-500">发送消息</span>
                            <span className="ml-2 text-gray-700">Send a Message</span>
                        </h2>

                        {isSubmitted ? (
                            <div className="py-8 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4">
                                    <i className="fas fa-check text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">谢谢您的留言！</h3>
                                <p className="text-gray-600 mb-6">我们已收到您的消息，将尽快回复您。</p>
                                <p className="text-gray-500">Thank you for your message! We've received it and will get back to you soon.</p>
                                <Button
                                    className="mt-4 bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    发送新消息 / Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">姓名 / Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="您的姓名 / Your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">电子邮件 / Email <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="您的邮箱 / Your email"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">电话 / Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="您的电话号码 / Your phone number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>主题 / Subject <span className="text-red-500">*</span></Label>
                                    <RadioGroup
                                        value={formData.subject}
                                        onValueChange={handleRadioChange}
                                        className="flex flex-wrap gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="general" id="general" />
                                            <Label htmlFor="general" className="cursor-pointer">一般咨询 / General Inquiry</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="lessons" id="lessons" />
                                            <Label htmlFor="lessons" className="cursor-pointer">课程问题 / Lesson Questions</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="technical" id="technical" />
                                            <Label htmlFor="technical" className="cursor-pointer">技术支持 / Technical Support</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="feedback" id="feedback" />
                                            <Label htmlFor="feedback" className="cursor-pointer">反馈建议 / Feedback</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">消息 / Message <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="请输入您的消息 / Please enter your message"
                                        rows={5}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-600 text-white px-8"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            发送中... / Sending...
                                        </>
                                    ) : (
                                        "发送消息 / Send Message"
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-12 w-full bg-gray-50">
                <div className="container max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">
                        <span className="text-red-500">我们的位置</span>
                        <span className="ml-2 text-gray-700">Our Location</span>
                    </h2>
                    <div className="rounded-2xl overflow-hidden h-[400px] shadow-sm">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-500">地图加载中... / Map loading...</p>
                            {/* In a real app, you would embed a map here */}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 