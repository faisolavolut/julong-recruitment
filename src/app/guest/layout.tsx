"use client";
import "@/app/globals.css";
import FlowbiteFooterSection from "../components/flowbite-footer";
import DefaultHeaderNavigation from "../components/navbarHeader";
interface RootLayoutProps {
  children: React.ReactNode;
}
const GuestLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col max-w-screen bg-white min-h-screen">
      <DefaultHeaderNavigation />
      <div className="relative flex flex-col flex-grow">
        <div className="flex flex-grow flex-col ">
          <div className="lg:-10 mx-auto w-full max-w-screen-xl flex flex-col flex-grow">
            {children}
          </div>
        </div>
        <div className="flex flex-col">
          <FlowbiteFooterSection />
        </div>
      </div>
    </div>
  );
};

export default GuestLayout;
