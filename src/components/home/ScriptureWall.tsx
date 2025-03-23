
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Scripture {
  verse: string;
  reference: string;
}

const ScriptureWall = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const scriptures: Scripture[] = [
    {
      verse: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      reference: "John 3:16"
    },
    {
      verse: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
      reference: "Jeremiah 29:11"
    },
    {
      verse: "I can do all things through Christ who strengthens me.",
      reference: "Philippians 4:13"
    },
    {
      verse: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      reference: "Proverbs 3:5-6"
    },
    {
      verse: "The LORD is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
      reference: "Psalm 23:1-3"
    },
    {
      verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
      reference: "Joshua 1:9"
    }
  ];
  
  const toggleScripture = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };
  
  return (
    <section className="py-16 md:py-24 bg-church-blue-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
            Interactive Scripture Wall
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
            Today's Words of Wisdom
          </h2>
          <p className="max-w-2xl mx-auto text-church-neutral-700">
            Click on any verse to reveal its full message. Let these scriptures inspire your day 
            and strengthen your faith journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scriptures.map((scripture, index) => (
            <div 
              key={index}
              className={`glass-panel p-6 cursor-pointer transition-all duration-300 hover:shadow-card ${
                activeIndex === index ? 'bg-church-gold-light' : ''
              }`}
              onClick={() => toggleScripture(index)}
            >
              {activeIndex === index ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="text-church-neutral-800">{scripture.verse}</p>
                  <p className="text-right font-medium text-church-neutral-600">{scripture.reference}</p>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center min-h-[150px]">
                  <p className="text-xl font-medium text-church-neutral-900">{scripture.reference}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScriptureWall;
