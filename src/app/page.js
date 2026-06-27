import Banner from "./components/Banner";
import DemoCredentials from "./components/DemoCredentials";
import FeaturedPrompts from "./components/FeaturedPrompt";
import PromptLab from "./components/PromptLab";
import StatsSection from "./components/StatsSection";
import TrendingCategories from "./components/TrendingCategories";
import WhyChooseUs from "./components/WhyChooseUs";
import { getPrompts } from "@/lib/api/prompts";
import TopCreators from "./components/TopCreators";
import CustomerReviews from "./components/CustomerReviews";
import { getAllReviews } from "@/lib/api/reviews";
import Link from "next/link";

export default async function Home() {
  const data = await getPrompts();
  const prompts = data?.prompts || [];
  const latestPrompts = prompts.slice(0, 6);
   let reviews = [];

  try {
    const result = await getAllReviews();
    reviews = Array.isArray(result) ? result : result?.reviews || [];
  } catch (error) {
    console.error("Failed to load homepage reviews:", error);
    reviews = [];
  }

  return (
    <main>
      <Banner />
      <FeaturedPrompts></FeaturedPrompts>
      <TrendingCategories />
      <StatsSection />

      
      <TopCreators />
      <CustomerReviews reviews={reviews} />
      <PromptLab />
      <WhyChooseUs />
      <DemoCredentials></DemoCredentials>
    </main>
  );
}