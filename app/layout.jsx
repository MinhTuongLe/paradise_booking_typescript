import ClientOnly from "@/components/ClientOnly";
import Footer from "@/components/Footer";
import ToastContainerBar from "@/components/ToastContainerBar";
import LoginModal from "@/components/models/LoginModal";
import RegisterModal from "@/components/models/RegisterModal";
import ForgotPasswordModal from "@/components/models/ForgotPasswordModal";
import RentModal from "@/components/models/RentModal";
import SearchModal from "@/components/models/SearchModal";
import CommentsModal from "@/components/models/CommentsModal";
import RoomCommentsModal from "@/components/models/RoomCommentsModal";
import ReportModal from "@/components/models/ReportModal";
import WishlistModal from "@/components/models/WishlistModal";
import BecomeVendorModal from "@/components/models/BecomeVendorModal";
import PropertiesFilteredModal from "@/components/models/PropertiesFilteredModal";
import ConfirmDeleteModal from "@/components/models/ConfirmDeleteModal";
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

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <StoreProvider>
          <ClientOnly>
            <ToastContainerBar />
            {/* <SearchModal /> */}
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
