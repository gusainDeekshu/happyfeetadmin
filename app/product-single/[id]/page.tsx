import Header from "@/components/layout/header/Header";
import CommonBanner from "@/components/layout/banner/CommonBanner";
import ProductDetails from "@/components/containers/shop/ProductDetails";
import FooterTwo from "@/components/layout/footer/FooterTwo";
import InitCustomCursor from "@/components/layout/InitCustomCursor";
import ScrollProgressButton from "@/components/layout/ScrollProgressButton";
import Animations from "@/components/layout/Animations";

type PageProps = {
  params: {
    id: string; // Replace 'id' with the parameter you're passing
  };
};

const page = ({ params }: PageProps) => {
  return (
    <div className="my-app">
      <Header />
      <main>
        <CommonBanner title="APPLICATION DETAILS" />
        <ProductDetails id={params.id}/>
      </main>
      <FooterTwo />
      <InitCustomCursor />
      <ScrollProgressButton />
      <Animations />
    </div>
  );
};

export default page;
