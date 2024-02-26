import ClientOnly from "@/components/ClientOnly";
import Footer from "@/components/Footer";
import ToastContainerBar from "@/components/ToastContainerBar";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import RentModal from "@/components/modals/RentModal";
import CommentsModal from "@/components/modals/CommentsModal";
import RoomCommentsModal from "@/components/modals/RoomCommentsModal";
import ReportModal from "@/components/modals/ReportModal";
import WishlistModal from "@/components/modals/WishlistModal";
import BecomeVendorModal from "@/components/modals/BecomeVendorModal";
import PropertiesFilteredModal from "@/components/modals/PropertiesFilteredModal";
import Navbar from "@/components/navbar/Navbar";
import { Nunito } from "next/font/google";
import "../styles/globals.css";
import { StoreProvider } from "../store/StoreProvider";

export const metadata = {
  title: "Paradise",
  description: "Paradise",
  icons:
    "https://firebasestorage.googleapis.com/v0/b/paradise-booking-app.appspot.com/o/icon.png?alt=media&token=b81865c8-a944-429f-bf2d-a90441163cac",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <StoreProvider>
          <ClientOnly>
            <ToastContainerBar />
            <RegisterModal />
            <LoginModal />
            <ForgotPasswordModal />
            <RentModal />
            <CommentsModal />
            <RoomCommentsModal />
            <ReportModal />
            <WishlistModal />
            <BecomeVendorModal />
            <PropertiesFilteredModal />
            <Navbar />
          </ClientOnly>
          <div className="pb-20 min-h-[70vh] pt-[10vh]">{children}</div>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
