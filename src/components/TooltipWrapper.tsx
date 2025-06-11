// components/TooltipWrapper.tsx

'use client';

import Tooltip from './Tooltip';

const TooltipWrapper = () => {
    return (
        <>
            <Tooltip text="Full Stack Software Engineer" tooltipText="A developer proficient in both frontend and backend technologies, capable of handling entire application development lifecycle." /> with extensive expertise in modern web development and enterprise software solutions. Specializing in building scalable applications using <Tooltip text="Next.js" tooltipText="A powerful React framework that enables server-side rendering and static site generation" />, <Tooltip text="React" tooltipText="A JavaScript library for building user interfaces with reusable components" />, <Tooltip text="TypeScript" tooltipText="A typed superset of JavaScript that adds optional static typing" />, and Node.js, delivering high-performance solutions for complex business challenges.
            <br /><br />
            As a <Tooltip text="Software Developer" tooltipText="Professional who designs, develops, and maintains software applications" /> with over a decade of hands-on experience, I&apos;ve architected and implemented numerous <Tooltip text="mission-critical applications" tooltipText="Applications that are essential for the success of an organization's operations" />, focusing on clean code principles, <Tooltip text="microservices architecture" tooltipText="An architectural style that structures an application as a collection of small autonomous services" />, and cloud-native solutions. My technical proficiency spans full-stack development, from frontend optimization to backend system design.
            <br /><br />
            Core Competencies:<br />
            - <Tooltip text="Full Stack Development" tooltipText="Development of both client-side and server-side applications using modern frameworks and technologies" />: React.js, Next.js, Node.js, TypeScript, JavaScript<br />
            - <Tooltip text="Backend Technologies" tooltipText="Server-side technologies that handle business logic and data management" />: Python, Java, RESTful APIs, GraphQL<br />
            - <Tooltip text="Cloud Infrastructure" tooltipText="Scalable cloud computing services and platforms for deploying applications" />: AWS, Azure, Docker, Kubernetes<br />
            - <Tooltip text="Database Management" tooltipText="Design and maintenance of both SQL and NoSQL database systems" />: MongoDB, PostgreSQL, Redis<br />
            - <Tooltip text="DevOps & CI/CD" tooltipText="Practices and tools that automate and integrate software development and IT operations" />: Jenkins, GitHub Actions, GitLab CI<br />
            - <Tooltip text="Software Architecture" tooltipText="High-level structure of software systems, design patterns, and best practices" />: Microservices, Distributed Systems, System Design
            <br /><br />
        </>
    );
};

export default TooltipWrapper;
