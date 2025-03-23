
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const About = () => {
  const timelineEvents: TimelineEvent[] = [
    {
      year: "1985",
      title: "Humble Beginnings",
      description: "Grace Community began as a small Bible study of 15 people meeting in the founder's living room."
    },
    {
      year: "1988",
      title: "First Official Service",
      description: "After growing to over 50 regular attendees, we held our first official Sunday service in a rented school auditorium."
    },
    {
      year: "1995",
      title: "Building Dedication",
      description: "Our growing congregation celebrated the dedication of our first church building, constructed through the generous giving of members."
    },
    {
      year: "2002",
      title: "Community Outreach",
      description: "Began our community food pantry and counseling services, extending our ministry beyond Sunday services."
    },
    {
      year: "2008",
      title: "Pastor John's Leadership",
      description: "Pastor John Doe became our Senior Pastor, bringing new vision and energy to our church family."
    },
    {
      year: "2015",
      title: "Expansion & Renovation",
      description: "Completed a major expansion of our facilities to accommodate growth and enhance ministry capabilities."
    },
    {
      year: "2020",
      title: "Digital Ministry",
      description: "Launched online services and expanded our digital presence to reach more people with the gospel message."
    },
    {
      year: "Present",
      title: "Continuing the Mission",
      description: "Today, Grace Community continues to grow and evolve while remaining true to our mission of helping people experience God's grace."
    }
  ];
  
  const beliefs = [
    {
      title: "The Bible",
      description: "We believe the Bible is God's Word, fully inspired and without error, written under the inspiration of the Holy Spirit, and the supreme authority in all matters of faith and conduct."
    },
    {
      title: "God",
      description: "We believe in one God, creator of all things, infinitely perfect and eternally existing in three persons: Father, Son, and Holy Spirit."
    },
    {
      title: "Jesus Christ",
      description: "We believe Jesus Christ is fully God and fully man, conceived by the Holy Spirit, born of the virgin Mary, and lived a sinless life. He died on the cross as a sacrifice for our sins, rose bodily from the dead, and ascended to heaven."
    },
    {
      title: "Salvation",
      description: "We believe salvation is a gift from God, received through faith in Jesus Christ alone, not by works, and results in a transformed life."
    },
    {
      title: "The Holy Spirit",
      description: "We believe the Holy Spirit indwells every believer, empowering them for witness and service, and developing Christ-like character."
    },
    {
      title: "The Church",
      description: "We believe the church is the body of Christ, composed of all who have received Jesus Christ as Savior, called to worship, fellowship, discipleship, ministry, and evangelism."
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
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-church-neutral-900 mb-6">
                Our Story & Beliefs
              </h1>
              <p className="text-lg text-church-neutral-700">
                Learn about Grace Community's journey, what we believe, and the values that 
                guide our church community.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-church-gold-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                  Who We Are
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                  Our Mission & Vision
                </h2>
                <div className="space-y-4 text-church-neutral-700">
                  <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-church-neutral-900 mb-2">Our Mission</h3>
                    <p>
                      To help people experience God's grace, grow in faith, and discover 
                      their purpose through Jesus Christ.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-church-neutral-900 mb-2">Our Vision</h3>
                    <p>
                      To be a community where lives are transformed by God's love, 
                      creating a movement of grace that impacts our city and beyond.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-church-neutral-900 mb-2">Our Values</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Biblical Teaching & Spiritual Growth</li>
                      <li>Authentic Community & Relationships</li>
                      <li>Passionate Worship & Prayer</li>
                      <li>Compassionate Service & Outreach</li>
                      <li>Excellence & Integrity in All We Do</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-church-blue-light rounded-tl-2xl"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-church-gold-light rounded-br-2xl"></div>
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1503446018554-89d78568c3e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1622&q=80" 
                    alt="Church Community" 
                    className="rounded-xl shadow-card w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* History Timeline */}
        <section className="py-16 bg-church-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                Church History
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700">
                From humble beginnings to where we are today, explore the milestones 
                that have shaped our church community.
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-church-gold-light"></div>
              
              {/* Timeline Events */}
              <div className="space-y-12">
                {timelineEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className="md:w-1/2 flex justify-end md:justify-start">
                      <div className="glass-panel p-6 w-full md:max-w-sm">
                        <div className="text-church-gold text-lg font-bold mb-2">{event.year}</div>
                        <h3 className="text-xl font-bold text-church-neutral-900 mb-2">{event.title}</h3>
                        <p className="text-church-neutral-700">{event.description}</p>
                      </div>
                    </div>
                    
                    <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-church-gold rounded-full border-4 border-white"></div>
                    
                    <div className="md:w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Beliefs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-gold-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                What We Believe
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
                Statement of Faith
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700">
                The core biblical truths that unite us and guide our church's ministry and mission.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beliefs.map((belief, index) => (
                <div key={index} className="glass-panel p-6">
                  <h3 className="text-xl font-bold text-church-neutral-900 mb-4">{belief.title}</h3>
                  <p className="text-church-neutral-700">{belief.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-church-neutral-700 mb-6">
                Have questions about what we believe? We'd love to discuss it with you!
              </p>
              <Link to="/contact" className="btn-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
