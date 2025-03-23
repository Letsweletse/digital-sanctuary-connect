
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
                alt="Pastor John Doe" 
                className="rounded-xl shadow-card w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Welcome Message */}
          <div>
            <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
              A Message From Our Pastor
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
              Welcome to Our Church Family
            </h2>
            <div className="space-y-4 text-church-neutral-700">
              <p>
                Grace is not just our name—it's how we live. At Grace Community, we believe in creating a space 
                where everyone can experience God's love and grow in their faith journey.
              </p>
              <p>
                Whether you're new to faith or have been walking with God for years, you'll find a community 
                that welcomes you with open arms and encourages your spiritual growth.
              </p>
              <p>
                We invite you to join us this Sunday and see for yourself what makes our church special. 
                It's not the building—it's the people, the worship, and most importantly, 
                the presence of God among us.
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
                  <h4 className="font-semibold text-church-neutral-900">Pastor John Doe</h4>
                  <p className="text-sm text-church-neutral-600">Senior Pastor</p>
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
