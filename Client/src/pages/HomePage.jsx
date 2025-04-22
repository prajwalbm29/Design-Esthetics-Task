import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-100">
    
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Text Content */}
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  Welcome to <span className="text-purple-400">Prajwal's Task</span> Design Esthetics
                </h1>
                <p className="text-xl text-gray-300">
                  Discover the perfect blend of functionality and beauty in our designs. 
                  We create experiences that delight and inspire.
                </p>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => navigate('/register')}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
                  >
                    Get Started
                  </button>
                  <button className="px-6 py-3 border border-purple-400 text-purple-400 hover:bg-purple-900/30 rounded-lg font-medium transition">
                    Learn More
                  </button>
                </div>
              </div>
              
              {/* Image */}
              <div className="lg:w-1/2">
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Design Esthetics"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-bold text-white">Crafting Beautiful Experiences</h3>
                    <p className="text-gray-200">By Prajwal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-gray-800 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400">© 2025 Prajwal B M. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;