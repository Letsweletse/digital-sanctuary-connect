
import React, { useState, useEffect } from 'react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

const TestimonialCarousel = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "Finding Grace Community was like finding a second family. The support and love I've received here has transformed my life and deepened my faith in ways I never thought possible.",
      name: "Sarah Johnson",
      role: "Member since 2018",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    },
    {
      quote: "The teachings at Grace Community have given me the tools to live out my faith in my everyday life. I've grown not just spiritually, but as a husband and father as well.",
      name: "Michael Thomason",
      role: "Member since 2015",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    },
    {
      quote: "After moving to a new city, I was looking for a church that felt like home. From my first Sunday at Grace, I knew I'd found where I belonged. The genuine care and community here is extraordinary.",
      name: "Rebecca Chen",
      role: "Member since 2020",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80"
    }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };
  
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
            Stories of Faith
          </h2>
          <p className="max-w-2xl mx-auto text-church-neutral-700">
            Hear from our members about how Grace Community has impacted their lives
            and strengthened their walk with God.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="overflow-hidden relative">
            <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-4">
                  <div className="glass-panel p-8 md:p-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="md:w-1/3">
                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3 text-center md:text-left">
                        <svg className="w-10 h-10 text-church-gold-light mb-4 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="text-church-neutral-800 text-lg mb-6">{testimonial.quote}</p>
                        <div>
                          <h4 className="font-semibold text-church-neutral-900">{testimonial.name}</h4>
                          <p className="text-sm text-church-neutral-600">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentIndex === index ? 'bg-church-gold' : 'bg-church-neutral-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
