import HeroSlider from "../components/home/HeroSlider";
import FeatureCards from "../components/home/FeatureCards";
import SectionThree from "../components/home/SectionThree";
import SectionFour from "../components/home/SectionFour";
import SectionFive from "../components/home/SectionFive";
import SectionSix from "../components/home/SectionSix";
import SectionSeven from "../components/home/SectionSeven";
import SectionEight from "../components/home/SectionEight";

const Home = () => {
  return (
    <>
      {/* SECTION 1 */}
      <HeroSlider />

      {/* SECTION 2 */}
      <FeatureCards />

      {/* SECTION 3 */}
      <SectionThree /> 
      
      {/* SECTION 4 */}
      <SectionFour />

      {/* SECTION 5 */}
      <SectionFive />

      {/* SECTION 6 */}
      <SectionSix />

      {/* SECTION 7 */}
      <SectionSeven />

      {/* SECTION 7 */}
      <SectionEight />
    </>
  );
};

export default Home;
