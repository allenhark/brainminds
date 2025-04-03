import React from 'react'
import { Link } from 'react-router-dom'
import { Search, GraduationCap, Menu } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Superprof</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-gray-700 hover:text-blue-600">Find a Teacher</Link>
            <Link to="/become-teacher" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Become a Teacher
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar