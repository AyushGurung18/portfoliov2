"use client";
import Tooltip from '../components/Tooltip';

const About = () => {
    return (
        <section style={{ fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }} className="p-4 text-left">
            <div className="grid grid-cols-2 gap-4">
                <div className="text-md text-[#869094] mb-4">
                    <h2 style={{ fontFamily: 'Ubuntu, sans-serif' }} className="text-2xl text-white font-semibold tracking-tighter">⚡About Me</h2>
                    <br />
                    <div className='tracking-tight'>
                        Hey! I'm Ayush Gurung, I've been close to a computer since an early age, and been passionate about it ever since.
                        <br /><br />
                        <Tooltip text="Full Stack Software Engineer" tooltipText="A developer proficient in both frontend and backend technologies, capable of handling entire application development lifecycle." /> with extensive expertise in modern web development and enterprise software solutions. Specializing in building scalable applications using <Tooltip text="Next.js" tooltipText="A powerful React framework that enables server-side rendering and static site generation" />, <Tooltip text="React" tooltipText="A JavaScript library for building user interfaces with reusable components" />, <Tooltip text="TypeScript" tooltipText="A typed superset of JavaScript that adds optional static typing" />, and Node.js, delivering high-performance solutions for complex business challenges.
                        <br /><br />
                        As a <Tooltip text="Software Developer" tooltipText="Professional who designs, develops, and maintains software applications" /> with over a decade of hands-on experience, I've architected and implemented numerous <Tooltip text="mission-critical applications" tooltipText="Applications that are essential for the success of an organization's operations" />, focusing on clean code principles, <Tooltip text="microservices architecture" tooltipText="An architectural style that structures an application as a collection of small autonomous services" />, and cloud-native solutions. My technical proficiency spans full-stack development, from frontend optimization to backend system design.
                        <br /><br />
                        Core Competencies:<br />
                        - <Tooltip text="Full Stack Development" tooltipText="Development of both client-side and server-side applications using modern frameworks and technologies" />: React.js, Next.js, Node.js, TypeScript, JavaScript<br />
                        - <Tooltip text="Backend Technologies" tooltipText="Server-side technologies that handle business logic and data management" />: Python, Java, RESTful APIs, GraphQL<br />
                        - <Tooltip text="Cloud Infrastructure" tooltipText="Scalable cloud computing services and platforms for deploying applications" />: AWS, Azure, Docker, Kubernetes<br />
                        - <Tooltip text="Database Management" tooltipText="Design and maintenance of both SQL and NoSQL database systems" />: MongoDB, PostgreSQL, Redis<br />
                        - <Tooltip text="DevOps & CI/CD" tooltipText="Practices and tools that automate and integrate software development and IT operations" />: Jenkins, GitHub Actions, GitLab CI<br />
                        - <Tooltip text="Software Architecture" tooltipText="High-level structure of software systems, design patterns, and best practices" />: Microservices, Distributed Systems, System Design
                        <br /><br />
                    </div>    
                </div>
                <div className="mt-6 text-md text-[#869094] mb-4">
                    <div className="img-container justify-center flex items-center mb-4">
                        <img
                            src="/assets/3433.png"
                            alt="Ayush Gurung"
                            className="rounded-full w-60 h-auto shadow-[0_4px_10px_rgba(255,255,255,0.3)]"
                        />
                    </div>
                    <div className='tracking-tight'>
                        Currently focused on developing <Tooltip text="enterprise-grade" tooltipText="Software built to meet the demands and scale of large organizations" /> web applications, implementing cloud-native solutions, and optimizing application performance. Proven track record in delivering robust software solutions that drive business growth and technological innovation.
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