import React, { useState, useEffect } from 'react';
import { useImageLibrary } from '@/hooks/useImageLibrary';
import useMongoData from '@/hooks/useMongoData';
import { LeadershipPerson } from '@/types/leadershipTypes';

const Welcome = () => {
  // Use the provided pastor image directly
  const [pastorImage, setPastorImage] = useState(
    "https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/Pastor%20Kobus%20Bezuidenhout_1743680599419.jpeg"
  );
  
  const { uploadedImages } = useImageLibrary('general');
  const { data: leaders } = useMongoData<LeadershipPerson>('leadership');
  
  // We'll keep the useEffect but it will only run if the direct image is not available
  useEffect(() => {
    // Only try to find alternative images if the current image is not available
    if (!pastorImage || pastorImage.includes("data:image/jpeg;base64")) {
      // First try to find the senior pastor from leadership data
      const seniorPastor = leaders.find(
        leader => leader.isSeniorPastor || 
        leader.role?.toLowerCase().includes('senior')
      );
      
      if (seniorPastor && seniorPastor.image) {
        setPastorImage(seniorPastor.image);
        return;
      }
      
      // If no senior pastor found, try to use uploaded images
      if (uploadedImages && uploadedImages.length > 0) {
        // Look for pastor image
        const pastorImg = uploadedImages.find(img => 
          img.name.toLowerCase().includes('pastor') || 
          img.name.toLowerCase().includes('senior')
        );
        
        if (pastorImg) {
          setPastorImage(pastorImg.url);
        }
      }
    }
  }, [uploadedImages, leaders]);

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
                src={pastorImage} 
                alt="Pastor Kobus Bezuidenhout" 
                className="rounded-xl shadow-card w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Welcome Message */}
          <div>
            <span className="text-sm font-medium text-church-neutral-700"">
               About 
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6">
              Gate Gaborone
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
                In pursuit of its mandate, Gate Gaborone seeks to constructively and practically provide a biblical, 
                Christocentric model of ministry, offering a deeper spiritual encounter of the family of God.
              </p>
            </div>
            <div className="mt-8">
              <div className="flex items-center">
                <img 
                  src={pastorImage} 
                  alt="Pastor Kobus Bezuidenhout" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-church-neutral-900">Pastor Kobus Bezuidenhout</h4>
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
