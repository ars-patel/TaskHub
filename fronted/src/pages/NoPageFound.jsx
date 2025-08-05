import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NoPageFound = () => {
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    document.title = "Page Not Found | 404";
    
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0 });
      await controls.start({
        rotate: [0, 2, -2, 0],
        transition: { repeat: Infinity, duration: 6 }
      });
    };
    sequence();
  }, [controls]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Animated geometric background elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2 }}
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-gray-300"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              transform: `rotate(${Math.random() * 360}deg)`
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.03, 0.08, 0.03],
              rotate: [0, 180]
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </motion.div>

      {/* Main content */}
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
        >
          <div className="p-12 text-center">
            <div className="relative mb-12">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 6,
                }}
                className="text-[120px] font-bold text-gray-800 inline-block mx-1"
              >
                4
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                }}
                className="text-[120px] font-bold text-gray-900 inline-block mx-1"
              >
                0
              </motion.div>
              <motion.div
                animate={{
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 7,
                }}
                className="text-[120px] font-bold text-gray-700 inline-block mx-1"
              >
                4
              </motion.div>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-light text-gray-800 mb-6 tracking-tight"
            >
              Page Not Found
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed"
            >
              The requested page could not be located. It may have been moved, deleted, 
              or never existed in the first place.
            </motion.p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  onClick={() => navigate('/')}
                  className="relative overflow-hidden px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 border border-gray-900"
                >
                  <span className="relative z-10">Return Home</span>
                  <motion.span
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    className="absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300"
                  />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  onClick={() => window.history.back()}
                  className="relative overflow-hidden px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 border border-gray-300"
                >
                  <span className="relative z-10">Go Back</span>
                  <motion.span
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gray-900 transition-all duration-300"
                  />
                </button>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16"
            >
              <motion.div
                animate={{
                  x: [0, 10, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                }}
                className="text-4xl"
              >
                ⌘
              </motion.div>
              <p className="text-sm text-gray-500 mt-4">Error 404 • Page Not Found</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Minimalist floating elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gray-300 rounded-full"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, (Math.random() - 0.5) * 40],
            x: [0, (Math.random() - 0.5) * 40],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
};

export default NoPageFound; 