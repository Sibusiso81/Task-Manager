import React from 'react'
import { motion } from 'framer-motion'
import {  Coffee, ExternalLink, Github, Heart, Instagram, Linkedin, Mail, Twitter } from 'lucide-react'
function Contact() {
    
  return (
    <footer 
    id='Contact'
    className="w-full bg-white border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
              Aspire®
            </h1>
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="mt-2"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Succeed Together
              </h2>
            </motion.div>
          </div>
          <p className="text-gray-600 max-w-md">
            Empowering students and developers to reach their full potential
            through focused productivity and continuous learning.
          </p>
         
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
            Navigation
          </h3>
          <ul className="space-y-3">
            {["About", "How to Start", "Contact", "Support"].map((item) => (
              <motion.li
                key={item}
                whileHover={{
                  x: 4,
                }}
                className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"
              >
                <ExternalLink size={14} />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
            Connect
          </h3>
          <div className="flex gap-4">
            {[Twitter, Instagram, Linkedin, Github].map((Icon, index) => (
              <motion.a
                key={index}
              
                href="#"
                whileHover={{
                  y: -4,
                }}
                className="p-2 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
          <div className="mt-6">
            <a
              href="mailto:contact@aspire.com"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <Mail size={16} />
              contact@aspire.com
            </a>
          </div>
        </div>
        
      </div>
      <div className="pt-8 border-t border-gray-100 w-fir">
        <div className="flex flex-col  md:flex-row justify-between items-center gap-4 text-sm text-gray-600 w-full">
          <div className="flex items-center gap-2 text-end">
            <span>EST 2025</span>
            <span className="text-gray-300">|</span>
            <span>All rights reserved</span>
          </div>
          <motion.div
            className="flex items-center gap-2 "
            whileHover={{
              scale: 1.02,
            }}
          >
            Made with   <Heart size={14} className="text-red-500" /> and plenty
            <Coffee size={14} className="text-amber-700" /> 
          </motion.div>
        </div>
        
      </div>
    </div>
  </footer>

  )
}

export default Contact