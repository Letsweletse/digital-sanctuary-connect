
import React from 'react';
import YouTubeEmbed from '../../media/YouTubeEmbed';

const YouTubeTabContent = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 bg-white">
        <YouTubeEmbed channelId="gategaboronebotswana2702" />
      </div>
      
      <div className="glass-panel p-6 bg-white">
        <h3 className="text-xl font-bold text-church-neutral-900 mb-4">About Our YouTube Channel</h3>
        <p className="text-church-neutral-700 mb-4">
          Subscribe to our YouTube channel to stay updated with the latest sermons, events, and testimonies from Gate Gaborone Ministries.
        </p>
        
        <div className="bg-church-blue-light/30 border border-church-blue-light rounded-lg p-4 mt-4">
          <h4 className="font-medium text-church-neutral-800 mb-2">How to Share Our Videos</h4>
          <ol className="list-decimal list-inside space-y-2 text-church-neutral-700">
            <li>Visit our channel at <a href="https://www.youtube.com/@gategaboronebotswana2702" target="_blank" rel="noopener noreferrer" className="text-church-blue underline">YouTube.com/@gategaboronebotswana2702</a></li>
            <li>Find the video you want to share</li>
            <li>Click the "Share" button below the video</li>
            <li>Choose your preferred sharing method (social media, email, etc.)</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default YouTubeTabContent;
