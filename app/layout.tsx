import { Nunito } from "next/font/google";

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
import PostReviewModal from "@/components/modals/PostReviewModal";
import Navbar from "@/components/navbar/Navbar";
import "../styles/globals.css";
import { StoreProvider } from "../store/StoreProvider";
import AddNewPostGuiderModal from "@/components/modals/AddNewPostGuiderModal";
import BecomeGuiderModal from "@/components/modals/BecomeGuiderModal";
import ChatBot from "@/components/ChatBot/ChatBot";

export const metadata = {
  title: "Paradise",
  description: "Paradise",
  icons:
    "https://firebasestorage.googleapis.com/v0/b/paradise-booking-app-ts.appspot.com/o/logo%2Flogo-meta.png?alt=media&token=2d610445-dd1f-42b6-a5d1-fa08123a4fb5",
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
            <BecomeGuiderModal />
            <PostReviewModal />
            <AddNewPostGuiderModal />
            <Navbar />
          </ClientOnly>
          <div className="pb-20 min-h-[70vh] pt-[10vh]">{children}</div>
          <Footer />
          <ChatBot />
        </StoreProvider>
      </body>
    </html>
  );
}
