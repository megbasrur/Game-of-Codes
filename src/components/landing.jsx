import React from 'react';
import { Star, Trophy, Play, User, Home, Award } from 'lucide-react';
import Mario from '../assets/mario.png';
import Lightning from '../assets/lightning.png';
import Bg from '../assets/bg.png';
import Captain from '../assets/captain.png';
import Darth from '../assets/darth.png';
import Robot from '../assets/robot.png';
import { useNavigate } from 'react-router-dom';

export default function GamingLearningPlatform() {
  const navigate=useNavigate();

  const skillLevels = [
    {
      id: 1,
      level: 'Beginner',
      character: Mario,
       skills: [
      { name: 'Java', path: '/java' },
      { name: 'Python', path: '/landing' }
    ],
      colors: 'from-purple-600 to-red-500'
    },
    {
      id: 2,
      level: 'Intermediate', 
      character: Captain,
      skills: [
        {name: 'HTML', path: '/landing'},
        {name: 'CSS', path: '/landing'},
        
      ],
      colors: 'from-blue-600 to-purple-500'
    },
    {
      id: 3,
      level: 'Advanced',
      character: Darth,
      skills: [{name: 'Machine Learning', path: '/landing'}],
      colors: 'from-purple-800 to-pink-500'
    }
  ];

  return (
    <div className=" w-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Bg})` }}>
      

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 bg-[#D9D0FC]/55 mt-10 ml-10 mr-10 mb-10 rounded-3xl backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 ml-3 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-medium text-xl">UserName</span>
        </div>
        
        <nav className="flex items-center space-x-8 gap-20">
          <button className="text-white hover:text-purple-300 transition-colors flex items-center ">
            <Home className="w-10 h-7" />
            <span className='text-xl'>Home</span>
          </button>
          <button className="text-white hover:text-purple-300 transition-colors flex items-center">
            <Award className="w-10 h-7" />
            <span className='text-xl'>Leaderboard</span>
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-6 bg-purple-600 rounded-full relative">
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
          </div>
         
         <img src={Robot} alt="Robot" className='w-10 h-10 -ml-3'/>
        </div>
      </header>

      {/* Achievement Banner */}
      <div className="relative z-10 mx-4 mt-4 mb-8 flex justify-center">
        <div className="bg-gradient-to-r border-2 from-[#FF0080] to-[#FF8C00] rounded-lg p-4 flex items-center justify-between w-7xl h-20">
          <div className="flex items-center space-x-3">
            <Star className="w-10 h-10 text-yellow-300 fill-current" />
            <span className="text-white font-bold ml-7 text-2xl">You reached Level 3! Click to see rewards</span>
          </div>
          <Trophy className="w-13 h-13 mr-5 text-yellow-300" />
        </div>
      </div>

 {/* Skill Level Cards */}
<div className="relative z-10 px-4 space-y-10">
  {skillLevels.map((skill) => (
    <div key={skill.id} className="flex items-center space-x-6 relative">

      {/* Character with Level Badge */}
      <div className="relative flex-shrink-0 ">
        <img
          src={skill.character}
          alt={skill.level + " character"}
          className="w-96 h-96 object-contain z-20 relative"
        />
    
        {/* Level Badge overlapping the character */}
        <div className={`absolute top-1/2 border-2 left-full right-0 transform -translate-y-1/2 -translate-x-43 h-17 bg-gradient-to-r ${skill.colors} px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 w-61`}>
          <span className="text-white font-bold text-2xl ml-13">{skill.level}</span>
        </div>
      </div>
        {/* Lightning Bolt */}
        <div className='z-10 ml-2'>
         <img src={Lightning} alt="lightning" className='w-20 h-36'/>
      </div>

      {/* Skills Card */}
      <div className="flex-grow">
        <div className="bg-gradient-to-r from-red-600 to-blue-700 rounded-lg p-4 shadow-xl border-2 flex items-center justify-between h-50">
          <div className="flex space-x-4 gap-20 ml-20">
           {skill.skills.map((skillItem, skillIndex) => (
  <button
    key={skillIndex}
    className="text-white font-bold text-4xl"
    onClick={() => navigate(skillItem.path)}
  >
    {skillItem.name}
  </button>
))}
          </div>
          <button className="bg-green-500 hover:bg-green-600 transition-colors rounded-full p-2 shadow-lg">
            <Play className="w-6 h-6 text-white fill-current" />
          </button>
        </div>
      </div>

    </div>
  ))}
</div>

    </div>
  );
}