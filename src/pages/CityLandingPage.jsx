import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SEOHelmet from '../components/SEOHelmet';

const CITY_DATA = {
  muzaffarnagar: {
    name: 'Muzaffarnagar',
    state: 'Uttar Pradesh',
    hindiName: 'मुजफ्फरनगर',
    headline: 'Authentic Premium Chai in Muzaffarnagar | Chai Adda',
    subheadline: 'From our hometown to your cup, experience the original flavors of India\'s finest tea blends.',
    description: 'Born right here in Muzaffarnagar, Chai Adda brings you the freshest, 100% organic tea leaves and authentic masala chai blends. As our hometown, you get exclusive priority handling. Whether you are craving a strong morning wake-up cup or a soothing evening herbal infusion, our local roots ensure you receive the finest quality right to your doorstep, representing the true essence of Indian chai culture right where it all started.',
    deliveryNote: 'Same-day delivery in Muzaffarnagar.',
    keywords: 'best chai india, order chai online india, chai adda muzaffarnagar, buy organic tea online india, premium masala chai india, authentic indian chai, मुजफ्फरनगर चाय, चाय ऑर्डर करें',
    metaDesc: 'Order premium authentic chai in Muzaffarnagar from Chai Adda. 100% organic tea, masala chai, green tea. Same-day Muzaffarnagar delivery. Pan-India brand.',
    geo: { lat: '29.4727', lng: '77.7085' }
  },
  meerut: {
    name: 'Meerut',
    state: 'Uttar Pradesh',
    hindiName: 'मेरठ',
    headline: 'Premium Organic Tea Delivery in Meerut | Best Chai Online',
    subheadline: 'Energizing the bustling streets of Meerut with strong, aromatic, and 100% authentic masala chai.',
    description: 'Fuel your day in Meerut with Chai Adda\'s premium organic tea collection. We understand that western UP loves a strong, full-bodied cup of tea. That is why our exclusive masala chai and premium black tea blends are perfectly crafted for the Meerut palate. Experience farm-fresh, ethically sourced tea delivered fast to your home or office, giving you the perfect authentic Indian chai experience without stepping out.',
    deliveryNote: 'Fast 1-2 days delivery to Meerut.',
    keywords: 'best chai india, order tea online india, buy organic tea online india, chai delivery meerut, masala chai meerut, premium tea india, मेरठ चाय, चाय ऑर्डर करें',
    metaDesc: 'Fast chai delivery in Meerut. Buy premium organic tea, strong masala chai, and green tea online in India from Chai Adda. 1-2 days delivery for Meerut lovers.',
    geo: { lat: '28.9845', lng: '77.7064' }
  },
  saharanpur: {
    name: 'Saharanpur',
    state: 'Uttar Pradesh',
    hindiName: 'सहारनपुर',
    headline: '100% Organic Masala Chai in Saharanpur | Chai Adda',
    subheadline: 'Purity in every sip. Bring home India\'s finest, naturally grown tea blends to Saharanpur.',
    description: 'For the tea lovers in Saharanpur who value natural and organic lifestyles, Chai Adda offers an unmatched selection of premium herbal, green, and masala teas. Our blends are crafted using sustainably harvested leaves and pure Indian spices. Enjoy a refreshing, healthy, and authentic cup of chai that reflects India’s rich tea heritage, delivered swiftly and directly to your Saharanpur home.',
    deliveryNote: 'Swift 1-2 days delivery to Saharanpur.',
    keywords: 'best chai india, order tea online india, organic chai saharanpur, buy herbal tea india, premium chai india, saharanpur tea online, सहारनपुर चाय, ऑर्गेनिक चाय',
    metaDesc: 'Order organic chai online in Saharanpur. Premium masala tea, green tea blends delivered fast. Chai Adda brings India\'s best authentic tea to your door.',
    geo: { lat: '29.9640', lng: '77.5460' }
  },
  delhi: {
    name: 'Delhi',
    state: 'Delhi',
    hindiName: 'दिल्ली',
    headline: 'Best Chai Delivery in Delhi | Order Premium Tea Online',
    subheadline: 'The capital deserves the best. Authentic, bold, and organic chai delivered across Delhi NCR.',
    description: 'From the busy streets of Connaught Place to peaceful South Delhi corners, Delhi runs on chai. Chai Adda brings India\'s finest loose-leaf teas and organic masala chai directly to the capital. Skip the cafe lines and enjoy barista-quality, premium Indian tea in the comfort of your home. Whether it is a winter morning or a rainy afternoon, our fast Delhi delivery ensures your perfect cup is always ready.',
    deliveryNote: '2-3 days delivery across Delhi & NCR.',
    keywords: 'best chai india, order tea online india, chai delivery delhi, buy organic tea online delhi, best tea brand india, premium masala chai delhi, दिल्ली चाय, चाय ऑनलाइन',
    metaDesc: 'Looking for the best chai in Delhi? Buy organic masala chai and premium tea online from Chai Adda. Fast 2-3 days delivery across Delhi. Order now!',
    geo: { lat: '28.6139', lng: '77.2090' }
  },
  noida: {
    name: 'Noida',
    state: 'Uttar Pradesh',
    hindiName: 'नोएडा',
    headline: 'Premium Organic Tea in Noida | Corporate & Home Delivery',
    subheadline: 'Elevate your workday and relax your evenings with India’s most trusted organic chai brand.',
    description: 'Noida’s fast-paced corporate life and modern homes demand a tea that refreshes and revitalizes. Chai Adda offers premium, health-conscious selections like pure green tea, immunity-boosting herbal blends, and classic strong masala chai. Perfect for the discerning Noida resident who values quality and wellness. Order online and experience the pan-India favorite delivered right to your Noida apartment or office.',
    deliveryNote: 'Reliable 2-3 days delivery to Noida.',
    keywords: 'best chai india, order tea online india, tea delivery noida, buy green tea noida, corporate tea delivery india, premium chai india, नोएडा चाय, ऑर्गेनिक चाय',
    metaDesc: 'Buy premium health-conscious organic tea and masala chai in Noida. Fast 2-3 days delivery to Noida offices and homes. Order India\'s finest tea online.',
    geo: { lat: '28.5355', lng: '77.3910' }
  },
  mumbai: {
    name: 'Mumbai',
    state: 'Maharashtra',
    hindiName: 'मुंबई',
    headline: 'Authentic Indian Chai Delivery in Mumbai | Chai Adda',
    subheadline: 'From cutting chai to premium organic blends, enjoy India’s best tea in the financial capital.',
    description: 'Mumbai may love its cutting chai, but when it’s time for a premium, authentic, and organic tea experience at home, Chai Adda is the ultimate choice. We deliver high-quality, ethically sourced masala chai, green tea, and exclusive gifting blends across Mumbai. Perfect for the heavy monsoons or a relaxing evening by the sea, our premium Indian teas bring the traditional warmth of homemade chai to your modern Mumbai lifestyle.',
    deliveryNote: 'Secure 3-4 days delivery across Mumbai.',
    keywords: 'best chai india, buy tea online mumbai, order tea online india, mumbai chai delivery, premium tea gifting india, organic tea india, मुंबई चाय, प्रीमियम चाय',
    metaDesc: 'Order authentic Indian chai and premium organic tea online in Mumbai. Chai Adda delivers the best masala chai pan-India. 3-4 days Mumbai delivery.',
    geo: { lat: '19.0760', lng: '72.8777' }
  },
  bengaluru: {
    name: 'Bengaluru',
    state: 'Karnataka',
    hindiName: 'बेंगलुरु',
    headline: 'Organic Green Tea & Masala Chai in Bengaluru',
    subheadline: 'Tech city’s favorite health-conscious, premium organic tea delivered to your doorstep.',
    description: 'Bengaluru’s vibrant, health-conscious tech community deserves a tea brand that matches its innovative spirit. Chai Adda brings you 100% organic, pesticide-free green teas, detoxifying herbal blends, and the classic Indian masala chai. Whether you are coding late into the night or enjoying Bengaluru’s pleasant morning weather, our premium teas offer the perfect, refreshing cup. Order online for seamless delivery across the IT capital.',
    deliveryNote: 'Dependable 3-4 days delivery to Bengaluru.',
    keywords: 'best chai india, organic chai bengaluru, order tea online india, buy green tea online bengaluru, premium tea india, health tea india, बेंगलुरु चाय, हरी चाय',
    metaDesc: 'Buy 100% organic green tea and premium masala chai online in Bengaluru. Chai Adda offers the best authentic Indian tea with 3-4 days secure delivery.',
    geo: { lat: '12.9716', lng: '77.5946' }
  },
  lucknow: {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    hindiName: 'लखनऊ',
    headline: 'Royal & Authentic Masala Chai in Lucknow | Order Online',
    subheadline: 'Complementing the rich culinary heritage of Lucknow with India’s most flavorful premium teas.',
    description: 'In a city deeply rooted in heritage and culinary perfection like Lucknow, only the most authentic and aromatic chai will do. Chai Adda combines premium crushed Indian spices with top-grade Assam tea leaves to create a masala chai worthy of the Nawabs. Elevate your morning rituals and evening gatherings with a royal tea experience, delivered directly to you in Lucknow from India’s trusted online tea brand.',
    deliveryNote: 'Prompt 2-3 days delivery to Lucknow.',
    keywords: 'best chai india, masala chai lucknow, order tea online india, premium tea lucknow, buy organic tea online up, authentic indian chai, लखनऊ चाय, नवाबों की चाय',
    metaDesc: 'Experience royal and authentic masala chai in Lucknow. Buy premium organic tea online from Chai Adda with 2-3 days delivery. India\'s best tea brand.',
    geo: { lat: '26.8467', lng: '80.9462' }
  },
  jaipur: {
    name: 'Jaipur',
    state: 'Rajasthan',
    hindiName: 'जयपुर',
    headline: 'Premium Heritage Tea Delivery in Jaipur | Chai Adda',
    subheadline: 'Strong, flavorful, and royal chai blends delivered to the Pink City.',
    description: 'Jaipur\'s rich culture and grandiose lifestyle call for a chai that makes a statement. Chai Adda offers robust, richly flavored masala chai and elegant loose-leaf black teas that resonate with Rajasthan’s royal heritage. Perfect for welcoming guests or enjoying a peaceful sunset over the Pink City, our pan-India delivery ensures the absolute freshest, highest quality tea reaches your Jaipur residence.',
    deliveryNote: 'Reliable 2-3 days delivery to Jaipur.',
    keywords: 'best chai india, chai jaipur delivery, order tea online india, premium rajasthan tea, buy organic tea india, authentic indian chai, जयपुर चाय, प्रीमियम चाय',
    metaDesc: 'Order premium heritage tea and authentic masala chai online in Jaipur. Chai Adda delivers India\'s finest organic tea to the Pink City in 2-3 days.',
    geo: { lat: '26.9124', lng: '75.7873' }
  },
  kolkata: {
    name: 'Kolkata',
    state: 'West Bengal',
    hindiName: 'कोलकाता',
    headline: 'Finest Organic Tea Delivery in Kolkata | Best Chai Online',
    subheadline: 'For the city that understands tea best, we bring India’s finest premium and organic blends.',
    description: 'Kolkata is the undisputed capital of India’s tea culture. Chai Adda honors this deep-rooted tradition by providing the absolute pinnacle of premium, organic tea blends. From the robust strength of early morning chai to the delicate nuances of fine loose-leaf Darjeeling and Assam teas, we cater to the refined palates of Kolkata’s tea connoisseurs. Experience the best of India’s tea gardens delivered safely to Bengal.',
    deliveryNote: 'Safe 3-4 days delivery to Kolkata.',
    keywords: 'best chai india, tea online kolkata, order tea online india, premium loose leaf tea kolkata, buy organic tea india, authentic bengali chai lovers, कोलकाता चाय, चाय डिलीवरी',
    metaDesc: 'The finest premium organic tea for Kolkata\'s tea connoisseurs. Buy authentic masala chai and loose-leaf tea online from Chai Adda. 3-4 days delivery.',
    geo: { lat: '22.5726', lng: '88.3639' }
  }
};

const CityLandingPage = ({ citySlug }) => {
  const city = CITY_DATA[citySlug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [citySlug]);

  if (!city) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold">City Not Found</h1>
      </div>
    );
  }

  // LocalBusiness Schema targeting both the city and the pan-India focus
  const citySchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Chai Adda",
    "url": `https://www.chaiadda.co.in/chai-${citySlug}`,
    "image": "https://www.chaiadda.co.in/og-image.jpg",
    "description": `Premium pan-India online tea brand delivering authentic organic chai to ${city.name}.`,
    "telephone": "+919876543210",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city.name,
      "addressRegion": city.state,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": city.geo.lat,
      "longitude": city.geo.lng
    },
    "areaServed": [
      {
        "@type": "City",
        "name": city.name
      },
      {
        "@type": "Country",
        "name": "India"
      }
    ],
    "priceRange": "₹"
  };

  return (
    <>
      <SEOHelmet
        title={`${city.headline} | Chai Adda | Order Tea Online India`}
        description={city.metaDesc}
        url={`https://www.chaiadda.co.in/chai-${citySlug}`}
        keywords={city.keywords}
        schema={citySchema}
        breadcrumbs={[
          { name: "Home", url: "https://www.chaiadda.co.in/" },
          { name: city.name, url: `https://www.chaiadda.co.in/chai-${citySlug}` }
        ]}
      />

      <div className="min-h-screen bg-[#FAF9F6] text-[#385040]">
        
        {/* Dynamic Hero Section */}
        <div className="bg-[#385040] text-white py-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {city.headline}
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 text-gray-200">
              {city.subheadline}
            </p>
            <div className="inline-block bg-white text-[#385040] font-semibold py-2 px-6 rounded-full text-sm mb-8">
              {city.deliveryNote}
            </div>
            <br />
            <Link 
              to="/shop" 
              className="inline-block bg-[#E5B95E] hover:bg-[#c9a14d] text-[#385040] font-bold py-4 px-10 rounded-lg transition duration-300 text-lg"
            >
              Shop Now for India-Wide Delivery
            </Link>
          </div>
        </div>

        {/* Why City Loves Chai Adda */}
        <div className="py-16 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Why {city.name} ({city.hindiName}) Loves Chai Adda
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16 border-t-4 border-[#385040]">
            <p className="text-lg leading-relaxed text-gray-700">
              {city.description}
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-[#385040] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">🌱</div>
              <h3 className="font-bold text-xl mb-2">100% Organic</h3>
              <p className="text-gray-600 text-sm">Certified organic tea leaves grown without harmful pesticides.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-[#385040] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">🇮🇳</div>
              <h3 className="font-bold text-xl mb-2">Pan-India Reach</h3>
              <p className="text-gray-600 text-sm">Delivered straight from trusted farms to {city.name} and across India.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-[#385040] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">☕</div>
              <h3 className="font-bold text-xl mb-2">Authentic Blends</h3>
              <p className="text-gray-600 text-sm">Real Indian spices crushed and blended for the perfect authentic taste.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-[#385040] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">📦</div>
              <h3 className="font-bold text-xl mb-2">Secure Packaging</h3>
              <p className="text-gray-600 text-sm">Vacuum sealed to preserve freshness all the way to your doorstep.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#E5B95E] text-[#385040] py-16 px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for a Premium Tea Experience?</h2>
          <p className="text-xl mb-8">Enjoy Free Shipping Across India on all orders above ₹499.</p>
          <Link 
            to="/shop" 
            className="inline-block bg-[#385040] hover:bg-[#2c3f32] text-white font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            Explore Our Organic Collection
          </Link>
        </div>

      </div>
    </>
  );
};

CityLandingPage.propTypes = {
  citySlug: PropTypes.string.isRequired,
};

export default CityLandingPage;
