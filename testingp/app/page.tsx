import Header from "@/components/layout/header/Header";
import HomeBanner from "@/components/layout/banner/HomeBanner";
import TextSlider from "@/components/containers/home/TextSlider";
import Craft from "@/components/containers/home/Craft";
import Footer from "@/components/layout/footer/Footer";
import InitCustomCursor from "@/components/layout/InitCustomCursor";
import ScrollProgressButton from "@/components/layout/ScrollProgressButton";
import Animations from "@/components/layout/Animations";

const page = () => {
  return (
    <div className="my-app">
      <Header />
      <main>
        <HomeBanner />
        <TextSlider />
        <Craft />       
      </main>
      <Footer />
      <InitCustomCursor />
      <ScrollProgressButton />
      <Animations />
    </div>
  );
};

export default page;
