// components/About.tsx

import TooltipWrapper from './TooltipWrapper';
import Image from 'next/image';

const About = () => {
    return (
        <section className="p-4 text-left">
            <div className="grid lg:grid-cols-2 grid-col-1 gap-4">
                <div className="text-[#869094] mb-4">
                    <h2 style={{ fontFamily: 'Ubuntu, sans-serif' }} className="text-2xl text-white font-semibold tracking-tighter">⚡About Me</h2>
                    <br />
                    <div className='tracking-tight text-sm sm:text-base'>
                        Hey! I'm Ayush Gurung, I've been close to a computer since an early age, and been passionate about it ever since.
                        <br /><br />
                        <TooltipWrapper />
                    </div>    
                </div>
                <div className="mt-6 flex justify-between flex-col text-base text-[#869094] mb-4">
                    <div className="img-container justify-center flex items-center mb-4">
                        <Image
                            src="/assets/3433.png"
                            alt="Ayush Gurung"
                            width={240}
                            height={240}
                            className="rounded-full shadow-[0_4px_10px_rgba(255,255,255,0.3)]"
                        />
                    </div>
                    <div className='tracking-tight text-sm sm:text-base pt-10'>
                        Currently focused on developing enterprise-grade web applications, implementing cloud-native solutions, and optimizing application performance. Proven track record in delivering robust software solutions that drive business growth and technological innovation.
                        <br /><br />
                        Dedicated to staying at the forefront of software engineering best practices, continuously expanding expertise in emerging technologies and modern development methodologies. Committed to creating efficient, scalable, and maintainable code that sets new standards in software development.
                        <br /><br />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;