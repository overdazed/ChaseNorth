import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '../../assets/a_stationary_point-of-view_pov_video_from_inside_a_cozy_tent_looking_out_into_a_snowy_winter_night__1013qkb6zc33af2cvz0t_0.mp4';

const Hero = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        const startTime = 0;

        const handleLoadedMetadata = () => {
            video.currentTime = startTime;
        };

        const handleTimeUpdate = () => {
            if (video.currentTime >= video.duration || video.currentTime < startTime) {
                video.currentTime = startTime;
                video.play();
            }
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    return (
        <section className="relative h-screen">
            {/* Video background for the Hero section */}
            <div className="absolute inset-0 w-full h-screen overflow-hidden z-[-1]">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-bottom"
                >
                    <source src={heroVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Hero Text & Shop Now Button */}
            <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center z-10">
                <div className="text-center text-white p-6">
                    <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
                        Vacation <br /> Ready
                    </h1>
                    <p className="text-sm tracking-tighter md:text-lg mb-6">
                        Explore our vacation-ready outfits with fast worldwide shipping.
                    </p>
                    <Link to="#" className="bg-white text-gray-950 py-2 px-6 rounded-sm text-lg">
                        Shop Now
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
