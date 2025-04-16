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
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 6.07-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.07-.276-.134-.42-.19-.464-.145-.94-.22-1.427-.22z" />
              </svg>
            </Link>
            <Link to="#" className="text-gray-400 hover:text-red-500 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.004 5c-3.859 0-7 3.141-7 7 0 3.859 3.141 7 7 7 3.859 0 7-3.141 7-7 0-3.859-3.141-7-7-7zm0 12.5c-3.037 0-5.5-2.463-5.5-5.5s2.463-5.5 5.5-5.5 5.5 2.463 5.5 5.5-2.463 5.5-5.5 5.5z" />
                <path d="M12.004 8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5 1.5-.673 1.5-1.5 1.5z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}