
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProfileCard from '@/components/leadership/ProfileCard';

const Leadership = () => {
  const seniorPastor = {
    name: "Kobus Bezuidenhout",
    role: "Senior Pastor",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    bio: "Pastor Kobus Bezuidenhout is the Senior Pastor of Gate Gaborone Ministries. With a heart for teaching God's Word and mentoring future leaders, he has helped our congregation grow spiritually. He is passionate about making the timeless truths of scripture relevant to everyday life and establishing the apostolic vision for the Gate Family of Churches.",
    email: "pastor@gategaboroneministries.org",
    sermons: [
      { title: "Apostolic Foundations", url: "/sermons" },
      { title: "Walking in Faith", url: "/sermons" },
      { title: "Kingdom Principles", url: "/sermons" }
    ]
  };
  
  const elders = [
    {
      name: "Peter & Naomi Taylor",
      role: "Elders",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80",
      bio: "Peter and Naomi Taylor serve as elders at Gate Gaborone Ministries. With their combined gifts and commitment to the apostolic vision, they help guide our church family with wisdom and grace.",
      email: "taylors@gategaboroneministries.org"
    },
    {
      name: "Thabiso & Lesego Thwane",
      role: "Elders",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      bio: "Thabiso and Lesego Thwane are devoted elders who bring their unique strengths to the leadership team. They are passionate about seeing families thrive in their faith and helping establish the Kingdom of God in Gaborone.",
      email: "thwanes@gategaboroneministries.org"
    },
    {
      name: "Oteng & Carry Leepile",
      role: "Elders",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80",
      bio: "Oteng and Carry Leepile serve as elders with a heart for community outreach and discipleship. Their commitment to the apostolic vision helps strengthen the church's foundation and extend its influence in Gaborone.",
      email: "leepiles@gategaboroneministries.org"
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
