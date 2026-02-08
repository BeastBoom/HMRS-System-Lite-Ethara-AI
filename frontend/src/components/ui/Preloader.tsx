import { motion } from 'framer-motion';

export default function Preloader() {
  return (
    <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center overflow-hidden">
        {/* Large Breathing Green Rays */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-brand-500"
            style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{
              width: ['0px', '500px'],
              height: ['0px', '500px'],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Central Logo Container */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center p-8 bg-white rounded-full shadow-xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
        >
           <img 
              src="/vite.svg" 
              alt="HRMS Logo" 
              className="w-20 h-20 object-contain z-20 relative"
           />
        </motion.div>
    </div>
  );
}
