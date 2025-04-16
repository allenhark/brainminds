import { Link } from 'react-router-dom'
import { QRCodeSVG } from "qrcode.react";

export default function Footer() {

  const wechatId = "https://u.wechat.com/kDAHPYlSKR_Ae9fr_iygEOY?s=2";

  return (
    <footer className="bg-gray-900 text-white flex justify-center items-center">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Cities and Subjects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12 pb-12 border-b border-gray-800">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">北京 Beijing</h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li><Link to="/beijing/business-english" className="hover:text-red-500">商务英语 Business English</Link></li>
              <li><Link to="/beijing/ielts" className="hover:text-red-500">雅思 IELTS</Link></li>
              <li><Link to="/beijing/toefl" className="hover:text-red-500">托福 TOEFL</Link></li>
              <li><Link to="/beijing/kids" className="hover:text-red-500">少儿英语 Kids English</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">上海 Shanghai</h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li><Link to="/shanghai/business-english" className="hover:text-red-500">商务英语 Business English</Link></li>
              <li><Link to="/shanghai/ielts" className="hover:text-red-500">雅思 IELTS</Link></li>
              <li><Link to="/shanghai/toefl" className="hover:text-red-500">托福 TOEFL</Link></li>
              <li><Link to="/shanghai/conversation" className="hover:text-red-500">口语 Conversation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">广州 Guangzhou</h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li><Link to="/guangzhou/business-english" className="hover:text-red-500">商务英语 Business English</Link></li>
              <li><Link to="/guangzhou/ielts" className="hover:text-red-500">雅思 IELTS</Link></li>
              <li><Link to="/guangzhou/kids" className="hover:text-red-500">少儿英语 Kids English</Link></li>
              <li><Link to="/guangzhou/pronunciation" className="hover:text-red-500">发音 Pronunciation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">深圳 Shenzhen</h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li><Link to="/shenzhen/business-english" className="hover:text-red-500">商务英语 Business English</Link></li>
              <li><Link to="/shenzhen/toefl" className="hover:text-red-500">托福 TOEFL</Link></li>
              <li><Link to="/shenzhen/conversation" className="hover:text-red-500">口语 Conversation</Link></li>
              <li><Link to="/shenzhen/grammar" className="hover:text-red-500">语法 Grammar</Link></li>
            </ul>
          </div>
        </div>

        {/* Regular Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">客户支持 Customer Support</h3>
            <div className="space-y-2 text-xs md:text-sm text-gray-400">
              <QRCodeSVG
                value={wechatId}
                size={120}
                level="H"
                includeMargin={true}
                bgColor="#111827"
                fgColor="#ffffff"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">课程类型 Course Types</h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li><Link to="/subjects/business" className="hover:text-red-500">商务英语 Business English</Link></li>
              <li><Link to="/subjects/ielts" className="hover:text-red-500">雅思考试 IELTS Exam</Link></li>
              <li><Link to="/subjects/toefl" className="hover:text-red-500">托福考试 TOEFL Exam</Link></li>
              <li><Link to="/subjects/kids" className="hover:text-red-500">少儿英语 Children's English</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">帮助中心 Help Center</h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li><Link to="/become-tutor" className="hover:text-red-500">成为教师 Become a Teacher</Link></li>
              <li><Link to="/faq" className="hover:text-red-500">常见问题 FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-red-500">客户支持 Customer Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright and Social Links */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 md:mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-red-500 text-lg md:text-xl font-semibold">学习English</span>
            <span className="text-xs md:text-sm text-gray-400">© 2018 - 2025 Learn with passion!</span>
          </div>
          <div className="flex gap-4">
            <Link to="#" className="text-gray-400 hover:text-red-500 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>
            <Link to="#" className="text-gray-400 hover:text-red-500 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}