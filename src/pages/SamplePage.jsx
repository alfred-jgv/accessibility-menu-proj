import React from 'react';
import { FaPlane, FaHotel, FaMapMarkedAlt } from 'react-icons/fa';

const TravelDestinationsPage = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>Explore Amazing Travel Destinations</h1>
            <p style={{ color: '#34495e', fontSize: '18px' }}>Discover the most beautiful places around the world and plan your next adventure.</p>
            
            {/* Icon Section */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                    <FaPlane size={50} color="#3498db" />
                    <h3 style={{ color: '#2c3e50', marginTop: '10px' }}>Flights</h3>
                    <p style={{ color: '#7f8c8d' }}>Find the best flight deals to your dream destinations.</p>
                </div>
                <div style={{ textAlign: 'center', width: '200px' }}>
                    <FaHotel size={50} color="#e67e22" />
                    <h3 style={{ color: '#2c3e50', marginTop: '10px' }}>Hotels</h3>
                    <p style={{ color: '#7f8c8d' }}>Book comfortable and affordable hotels for your stay.</p>
                </div>
                <div style={{ textAlign: 'center', width: '200px' }}>
                    <FaMapMarkedAlt size={50} color="#27ae60" />
                    <h3 style={{ color: '#2c3e50', marginTop: '10px' }}>Tours</h3>
                    <p style={{ color: '#7f8c8d' }}>Explore guided tours and activities at your destination.</p>
                </div>
            </div>

            {/* Additional Paragraphs */}
            <div style={{ marginTop: '50px', textAlign: 'left', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
                <p style={{ color: '#34495e', fontSize: '18px', lineHeight: '1.6' }}>
                    Traveling is one of the most enriching experiences one can have. It allows you to immerse yourself in different cultures, taste new cuisines, and witness breathtaking landscapes. Whether you're exploring the bustling streets of Tokyo, relaxing on the pristine beaches of the Maldives, or hiking through the rugged trails of Patagonia, every destination offers a unique story waiting to be discovered.
                </p>
                <p style={{ color: '#34495e', fontSize: '18px', lineHeight: '1.6', marginTop: '20px' }}>
                    Planning your trip can be just as exciting as the journey itself. From choosing the perfect destination to booking flights and accommodations, every step brings you closer to your adventure. With the right resources and a bit of research, you can create an itinerary that suits your interests and budget, ensuring a memorable and stress-free experience.
                </p>
                <p style={{ color: '#34495e', fontSize: '18px', lineHeight: '1.6', marginTop: '20px' }}>
                    Don't forget to consider the local customs and traditions of the places you visit. Respecting and understanding the culture of your destination not only enhances your experience but also fosters a deeper connection with the people you meet along the way. Traveling responsibly and sustainably ensures that these beautiful destinations remain preserved for future generations to enjoy.
                </p>
            </div>

            {/* Call-to-Action Button */}
            <div style={{ marginTop: '40px' }}>
                <button 
                    style={{ 
                        padding: '15px 30px', 
                        fontSize: '18px', 
                        color: '#fff', 
                        backgroundColor: '#3498db', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Start Your Journey
                </button>
            </div>
        </div>
    );
};

export default TravelDestinationsPage;