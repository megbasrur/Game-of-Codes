import React, { useEffect } from 'react';
import { Play } from 'lucide-react';
import Mario from '../assets/mario.png';
import Captain from '../assets/captain.png';
import Darth from '../assets/darth.png';

import JavaIcon from '../assets/java.png';
import PythonIcon from '../assets/python.png';
import HTMLIcon from '../assets/html.png';
import CSSIcon from '../assets/css.png';
import MLIcon from '../assets/ml.png';
import FlaskIcon from '../assets/flask.png';
import JSIcon from '../assets/js.png';

import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import AppHeader from './AppHeader';

export default function GamingLearningPlatform() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        await apiRequest("/users/me");
      } catch {
        if (isMounted) navigate("/login");
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const skillLevels = [
    {
      id: 1,
      level: 'Beginner',
      character: Mario,
      skills: [
        { name: 'Java', path: '/java', image: JavaIcon },
        { name: 'Python', path: '/landing', image: PythonIcon },
      ],
      colors: 'from-purple-800 via-indigo-700 to-pink-500',
      groupImage: Mario,
    },
    {
      id: 2,
      level: 'Intermediate',
      character: Captain,
      skills: [
        { name: 'HTML', path: '/landing', image: HTMLIcon },
        { name: 'CSS', path: '/landing', image: CSSIcon },
        { name: 'JS', path: '/landing', image: JSIcon },
      ],
      colors: 'from-purple-800 via-indigo-700 to-pink-500',
      groupImage: Captain,
    },
    {
      id: 3,
      level: 'Advanced',
      character: Darth,
      skills: [
        { name: 'ML', path: '/landing', image: MLIcon },
        { name: 'Flask', path: '/landing', image: FlaskIcon },
      ],
      colors: 'from-purple-800 via-indigo-700 to-pink-500',
      groupImage: Darth,
    }
  ];

  return (
    <div className="w-screen min-h-screen relative overflow-hidden p-8">
      <div
        className="absolute w-full h-full top-0 left-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, #2B0B5A 0%, #1A0C3F 60%), 
                       linear-gradient(135deg, #2F2F6F 0%, #6B6CD9 70%, #A44EFF 100%)`,
        }}
      ></div>

      <div className="absolute w-3/5 h-3/5 top-10 left-20 bg-purple-500/50 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute w-2/5 h-2/5 bottom-10 right-10 bg-pink-500/40 rounded-full filter blur-3xl animate-pulse"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <AppHeader />
      </div>

      <div className="space-y-12 relative z-10 max-w-6xl mx-auto">
        {skillLevels.map((level) => (
          <div key={level.id} className="flex items-start gap-6">

            <div
              className={`relative w-15 h-70 bg-black rounded-4xl flex items-center border-1 border-gray-400 justify-center text-white font-bold shadow-lg`}
            >
              <span className="transform -rotate-90 text-3xl translate-y-4 -translate-x-1">{level.level}</span>
              <img
                src={level.character}
                alt={level.level}
                className="w-12 h-12 absolute top-3 right-1 rounded-full shadow"
              />
            </div>

            <div className="flex gap-6 flex-wrap">
              {level.skills.map((skill, index) => (
                <div
                  key={index}
                  className="w-sm h-70 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 rounded-2xl shadow-2xl flex flex-col items-center justify-start cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                  onClick={() => navigate(skill.path)}
                >
                  <div className="w-full h-1/2 flex items-center justify-center">
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                  </div>

                  <div className="w-full h-1/2 flex flex-col items-center justify-center space-y-2 p-3">
                    <span className="text-white font-bold text-xl">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-yellow-300 bg-gray-700 px-2 py-1 rounded-full">Level 3</span>
                      <span className="text-sm text-green-300 bg-gray-700 px-2 py-1 rounded-full">150 pts</span>
                    </div>
                    <div className="mt-2">
                      <button type="button" className="bg-green-500 hover:bg-green-600 p-3 rounded-full shadow-lg">
                        <Play className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
