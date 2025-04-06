
import React from 'react';

const ContactPageHeader = () => {
  return (
    <section className="bg-church-blue-light py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-church-neutral-900 mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-church-neutral-700">
            Have questions or want to get involved? 
            We'd love to hear from you and help in any way we can.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactPageHeader;
