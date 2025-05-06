"use client";
import About from "@/components/About";
import Project from "@/components/Project";
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
          className="p-4 text-left py-8 lg:py-40"
        >
          <motion.p 
            variants={itemVariants}
            className="lg:text-4xl md:text-2xl sm:text-xl font-semibold tracking-tighter text-[#3CCF91] mb-2"
          >
            Hey there!, I'm-
          </motion.p>
          
          <motion.h1 
            variants={itemVariants}
            className="text-9xl font-bold mb-2 tracking-tighter"
          >
            Ayush Gurung.
          </motion.h1>
          
          <motion.br variants={itemVariants} />
          <motion.br variants={itemVariants} />
          
          <motion.p 
            variants={itemVariants}
            className="text-4xl font-medium mb-4 tracking-tighter"
          >
            Software Engineer. <span className="text-[#869094]"> A self-taught developer with an <br/> interest in Computer Science.</span>
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="text-2xl text-[#869094]"
          >
            🚀 Currently specializing in Full-stack Engineering
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="text-2xl text-[#869094]"
          >
            ⚡Software Engineer at Draft n Craft
          </motion.p>
          
          <motion.br variants={itemVariants} />
          
          <motion.div 
            variants={itemVariants}
            className="mt-6 flex space-x-4"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex space-x-2 px-6 py-2 text-md font-semibold items-center text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer"
            >
              <FaGithub size={20} color="#3CCF91" />
              <span>Github</span>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex space-x-2 px-6 py-2 text-md font-semibold items-center text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer"
            >
              <FaLinkedin size={20} color="#3CCF91" />
              <span>LinkedIn</span>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex space-x-2 px-6 py-2 text-md font-semibold items-center text-white bg-[#141414] rounded hover:bg-[#292929] cursor-pointer"
            >
              <MdEmail size={20} color="#3CCF91" />
              <span>Email</span>
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