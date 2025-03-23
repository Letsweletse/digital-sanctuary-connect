
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProfileCard from '@/components/leadership/ProfileCard';

const Leadership = () => {
  const seniorPastor = {
    name: "Pastor John Doe",
    role: "Senior Pastor",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    bio: "Pastor John has been leading Grace Community Church for over 15 years. With a heart for teaching God's Word and mentoring future leaders, he has helped our congregation grow spiritually and numerically. He holds a Master of Divinity from Fuller Theological Seminary and is passionate about making the timeless truths of scripture relevant to everyday life. When not preaching or leading, Pastor John enjoys hiking with his family, reading historical biographies, and volunteering with local homeless ministries. His vision for Grace Community is to create a place where people from all walks of life can encounter God's love and discover their purpose.",
    email: "pastor@gracecommunity.org",
    sermons: [
      { title: "Finding Peace in Troubled Times", url: "/sermons" },
      { title: "Walking in Faith", url: "/sermons" },
      { title: "Renewing Your Mind", url: "/sermons" }
    ]
  };
  
  const elders = [
    {
      name: "Sarah Smith",
      role: "Elder - Women's Ministry",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80",
      bio: "Sarah leads our Women's Ministry with grace and wisdom. With a background in counseling and a passion for mentoring, she has created programs that foster deep relationships and spiritual growth among women of all ages. Sarah has been part of our church for 12 years and serves alongside her husband and two children.",
      email: "sarah@gracecommunity.org"
    },
    {
      name: "Mark Johnson",
      role: "Elder - Outreach & Missions",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      bio: "Mark oversees our community outreach and global missions initiatives. With experience in both local and international mission work, he helps our congregation find meaningful ways to serve others and share God's love. Mark is particularly passionate about clean water projects and has led teams to install wells in developing countries.",
      email: "mark@gracecommunity.org"
    },
    {
      name: "Rachel Thompson",
      role: "Elder - Worship & Arts",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80",
      bio: "Rachel brings over 20 years of experience in music ministry to her role leading our worship and arts programs. With a degree in Music Education and a heart for creative expression in worship, she has developed our church's music ministry, drama team, and visual arts initiatives. Rachel believes that worship extends beyond Sunday services into every aspect of our lives.",
      email: "rachel@gracecommunity.org"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 page-transition">
        {/* Page Header */}
        <section className="bg-church-blue-light py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Our Leadership
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-church-neutral-900 mb-6">
                Meet Our Team
              </h1>
              <p className="text-lg text-church-neutral-700">
                Get to know the dedicated individuals who guide our church with wisdom, 
                compassion, and a deep commitment to God's Word.
              </p>
            </div>
          </div>
        </section>
        
        {/* Leadership Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-church-neutral-900 mb-8">
                Senior Pastor
              </h2>
              <ProfileCard {...seniorPastor} isSeniorPastor={true} />
            </div>
            
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-church-neutral-900 mb-8">
                Elders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {elders.map((elder, index) => (
                  <ProfileCard key={index} {...elder} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leadership;
