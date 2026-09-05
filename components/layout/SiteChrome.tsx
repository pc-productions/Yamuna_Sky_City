"use client";

import { useEffect, useState, type ReactNode } from "react";
import { captureAttribution } from "@/lib/attribution";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PersistentCTA } from "@/components/layout/PersistentCTA";
import { EnquiryModal } from "@/components/modal/EnquiryModal";

export function SiteChrome({ children }: { children: ReactNode }) {
  const [isModalOpen, setModalOpen] = useState(false);

  // First-touch marketing attribution (UTMs, referrer, landing page) for
  // the enquiry lead record — captured once per session, read at submit.
  useEffect(() => {
    captureAttribution();
  }, []);

  return (
    <>
      <Header onEnquire={() => setModalOpen(true)} />
      <main id="top" className="flex-1 pb-20 xl:pb-0">
        {children}
      </main>
      <Footer />
      <PersistentCTA onEnquire={() => setModalOpen(true)} />
      <EnquiryModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
