
import React from 'react';

const Welcome = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Pastor Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-church-blue-light rounded-tl-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-church-gold-light rounded-br-2xl"></div>
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1567515004624-219c11d31f2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
                alt="Pastor" 
                className="rounded-xl shadow-card w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Welcome Message */}
          <div>
            <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
              Our Story & Vision
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
              The Gate Family of Churches
            </h2>
            <div className="space-y-4 text-church-neutral-700">
              <p>
                Gate Gaborone, as part of the Gate Family of churches, was birthed through a divine mandate given in a conference in 2012. 
                The directive was unequivocally simple and clear — a new season has dawned upon the church that must visibly announce 
                and tangibly express itself through congregations strategically positioned in gateway cities globally.
              </p>
              <p>
                This season, named in some circles as the 'apostolic season', was born at least two decades ago in relative obscurity 
                and insignificance. Through this period of time, it has endured the rigorous process of spiritual and physical formation 
                before presenting itself as a fresh biblical paradigm distinct from that of its Pentecostal/Charismatic counterparts.
              </p>
              <p>
                At the heart of this season is the passionate pursuit to align the church to apostolic biblical patterns, 
                free from conformity to secular and humanistic influences. GGB serves as an apostolic center in the heart of the 
                economic capital of Botswana. Its mandate is to be a strategic gate for the presentation, proclamation, and modeling 
                of the apostolic message to the nations.
              </p>
              <p>
                In pursuit of its mandate, Gate Gaborone Ministries seeks to constructively and practically provide a biblical, 
                Christocentric model of ministry, offering a deeper spiritual encounter of the family of God.
              </p>
            </div>
            <div className="mt-8">
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Pastor Signature" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-church-neutral-900">Senior Pastor</h4>
                  <p className="text-sm text-church-neutral-600">Gate Gaborone Ministries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
