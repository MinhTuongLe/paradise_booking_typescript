"use client";
import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";

function NotFoundPage() {
  return (
    <ClientOnly>
      <Container>
        <h1 className="text-5xl font-extrabold text-center text-rose-500 mt-16 mb-6">
          404 - Page not found
        </h1>
        <p className="text-2xl text-center text-gray-700 font-semibold">
          Sorry, the page you are looking for does not exist.
        </p>
      </Container>
    </ClientOnly>
  );
}

export default NotFoundPage;
