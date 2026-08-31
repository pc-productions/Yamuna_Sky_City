"use client";

import { useState, type ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PersistentCTA } from "@/components/layout/PersistentCTA";
import { EnquiryModal } from "@/components/modal/EnquiryModal";

export function SiteChrome({ children }: { children: ReactNode }) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Header onEnquire={() => setModalOpen(true)} />
      <main id="top" className="flex-1 pb-16 xl:pb-0">
        {children}
      </main>
      <Footer />
      <PersistentCTA onEnquire={() => setModalOpen(true)} />
      <EnquiryModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
