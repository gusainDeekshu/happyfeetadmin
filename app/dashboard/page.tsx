import AccountDetails from "@/components/containers/users/AccountDetails";
import Animations from "@/components/layout/Animations";
import CommonBanner from "@/components/layout/banner/CommonBanner";
import FooterTwo from "@/components/layout/footer/FooterTwo";
import Header from "@/components/layout/header/Header";
import InitCustomCursor from "@/components/layout/InitCustomCursor";
import ScrollProgressButton from "@/components/layout/ScrollProgressButton";

const page = () => {
  return (
    <div className="my-app">
      <Header />
      <main>
        <CommonBanner title="My Account" />
        <AccountDetails />
      </main>
      <FooterTwo />
      <InitCustomCursor />
      <ScrollProgressButton />
      <Animations />
    </div>
  );
};

export default page;
