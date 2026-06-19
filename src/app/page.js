    // Assuming you create this // Your new animated section
import Banner from "./components/Banner";
import PromptLab from "./components/PromptLab";
import LiveFeed from "./components/PromptLab";
import TrendingCategories from "./components/TrendingCategories";
import WhyChooseUs from "./components/WhyChooseUs";

export default function Home() {
  return (
    <main>
      {/* The Hero usually goes first */}
      <Banner></Banner>
      <TrendingCategories></TrendingCategories>
      <PromptLab></PromptLab>
      {/* Your "Why Choose Us" section comes next in the scroll flow */}
      <WhyChooseUs></WhyChooseUs>
      
      {/* Add other sections here as you build them (e.g., <Episodes />, <Host />) */}
    </main>
  );
}