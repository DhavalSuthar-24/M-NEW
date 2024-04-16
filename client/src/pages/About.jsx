import React from 'react';

function About() {
  return (
    <div className=" min-h-screen flex justify-center items-center">
      <div className="max-w-2xl p-8 dark:bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-black">About DK's Blog</h2>
        <p className="text-lg mb-6 text-black">Welcome to DK's Blog, where we delve into various topics related to web development, programming, and more.</p>
        <h3 className="text-2xl font-bold mb-2 text-black">About Me</h3>
        <p className="text-lg mb-4 text-black">I'm Dhaval Suthar, currently working as an intern JavaScript developer at iFlair Web Technology Company. I'm passionate about web development and specialize in front-end technologies, particularly React.js. I have a keen interest in crafting visually appealing user interfaces, and I enjoy using Tailwind CSS for styling.</p>
        <p className="text-lg text-black">Feel free to explore the blog and learn along with me!</p>
      </div>
    </div>
  );
}

export default About;
