import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import NotificationClient from "./NotificationClient";

export const dynamic = "force-dynamic";

const NotificationPage = async () => {
  // if (!currentUser) {
  //   return <EmptyState title="Unauthorized" subtitle="Please login" />;
  // }
  return <NotificationClient />;
};

export default NotificationPage;
