import React from 'react';
import { 
  ReactIcon, 
  TailwindIcon, 
  MongoDBIcon, 
  NodeIcon 
} from 'lucide-react';

const technologies = [
  {
    name: 'React',
    description: 'Modern UI development framework',
    icon: <ReactIcon className="w-16 h-16 text-blue-500" />,
    link: 'https://reactjs.org'
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first styling framework',
    icon: <TailwindIcon className="w-16 h-16 text-teal-500" />,
    link: 'https://tailwindcss.com'
  },
  {
    name: 'MongoDB',
    description: 'Flexible NoSQL database',
    icon: <MongoDBIcon className="w-16 h-16 text-green-500" />,
    link: 'https://mongodb.com'
  },
  {
    name: 'Node.js',
    description: 'JavaScript runtime',
    icon: <NodeIcon className="w-16 h-16 text-lime-600" />,
    link: 'https://nodejs.org'
  }
];

const TechnologyShowcase = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {technologies.map((tech) => (
        <div 
          key={tech.name} 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 text-center"
        >
          <div className="flex justify-center mb-4">
            {tech.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{tech.name}</h3>
          <p className="text-gray-600 mb-4">{tech.description}</p>
          <a 
            href={tech.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Learn More
          </a>
        </div>
      ))}
    </div>
  );
};

export default TechnologyShowcase; 