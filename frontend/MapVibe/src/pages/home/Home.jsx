import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import homeService from "../../services/homeService";
import FeaturedListings from "./components/FeaturedListings";
import HeroSection from "./components/HeroSection";
import PopularCategories from "./components/PopularCategories";
import TestimonialsSection from "./components/TestimonialsSection";
import BusinessBenefitsSection from "./components/BusinessBenefitsSection";
import HowItWorksSection from "./components/HowItWorksSection";

const Home = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { popularCategories, popularLocations } =
          await homeService.getHomeData();

        setCategories(popularCategories || []);
        setListings(popularLocations || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHomeData();
  }, [user]);

  return (
    <>
      <HeroSection categories={categories} />

      <PopularCategories categories={categories} />

      <FeaturedListings listings={listings} setListings={setListings} />

      <TestimonialsSection />

      <BusinessBenefitsSection />

      <HowItWorksSection />
    </>
  );
};

export default Home;
