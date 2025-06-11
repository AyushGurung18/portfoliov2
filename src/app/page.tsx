"use client";
import About from "@/components/About";
import Project from "@/components/Projects";
import Blogs from "@/components/Blogs";
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";

export default function Home() {
  // Animation variants for staggered text reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <div>
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="px-4 text-left sm:py-40 pt-40 pb-20"
        >
          <motion.p 
            variants={itemVariants}
            className="lg:text-4xl text-2xl font-semibold tracking-tighter text-[#3CCF91] mb-2"
          >
            Hey there!, I'm-
          </motion.p>
          
          <motion.h1 
            variants={itemVariants}
            className="text-7xl md:text-8xl lg:text-9xl  font-bold mb-2 tracking-tighter"
          >
            Ayush Gurung.
          </motion.h1>
          
          <motion.br variants={itemVariants} />
          <motion.br variants={itemVariants} />
          
          <motion.p 
            variants={itemVariants}
            className="lg:text-4xl text-2xl font-medium mb-4 tracking-tighter"
          >
            Software Engineer. <span className="text-[#869094]"> A self-taught developer with an <br/> interest in Computer Science.</span>
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="lg:text-2xl md:text-lg text-sm text-[#869094]"
          >
            🚀 Currently specializing in Full-stack Engineering
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="lg:text-2xl md:text-lg text-sm text-[#869094]"
          >
            ⚡Software Engineer at Draft n Craft
          </motion.p>
          
          <motion.br variants={itemVariants} />
          
          <motion.div 
            variants={itemVariants}
            className="mt-6 flex flex-wrap sm:justify-start gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex space-x-2 sm:px-6 px-3 py-2 text-base font-semibold items-center text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer"
            >
              <a href="https://github.com/ayushgurung18" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center space-x-2">
              <FaGithub size={20} color="#3CCF91" />
              <span className="md:text-base text-sm">Github</span></div>
              </a>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex space-x-2 sm:px-6 px-3 py-2 text-base font-semibold items-center text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer"
            >
              <a href="https://linkedin.com/in/ayushgurung" target="_blank" rel="noopener noreferrer">
              <div className="flex items-center space-x-2">
              <FaLinkedin size={20} color="#3CCF91" />
              <span className="lg:text-base md:text-sm text-xs">LinkedIn</span></div>
              </a>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex space-x-2 sm:px-6 px-3 py-2 text-base font-semibold items-center text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer"
            >
              <a href="mailto:ayushgurung18sep@gmail.com">
              <div className="flex items-center space-x-2">
              <MdEmail size={20} color="#3CCF91" />
              <span className="lg:text-base md:text-sm text-xs">Email</span></div>
              </a>
            </motion.div>
          </motion.div>
        </motion.section>
        
        <About />
        <Project />
        <Blogs/>
      </div>
    </>
  );
}