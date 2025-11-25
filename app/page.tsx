"use client";

import { useState } from "react";
import DailyGM3Modal from "../components/DailyGM3Modal";
import DailyGM10Modal from "../components/DailyGM10Modal";

export default function Home() {
  const [isGM3ModalOpen, setIsGM3ModalOpen] = useState(false);
  const [isGM10ModalOpen, setIsGM10ModalOpen] = useState(false);

  const openGM3Modal = () => setIsGM3ModalOpen(true);
  const closeGM3Modal = () => setIsGM3ModalOpen(false);

  const openGM10Modal = () => setIsGM10ModalOpen(true);
  const closeGM10Modal = () => setIsGM10ModalOpen(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white gap-4">
        {/* グラデーション枠線用の外側のdiv */}
        <div
          className="rounded-[32px] p-[2px]"
          style={{
            background: 'linear-gradient(90deg, #FA9E9E 0%, #FAC79E 14%, #FAF19E 28%, #9EFAC3 42%, #9EFAFA 56%, #99B8FF 70%, #CC9EFA 84%, #FA9ECE 100%)'
          }}
        >
          {/* ボタンのコンテンツ */}
          <button
            onClick={openGM3Modal}
            className="flex items-center justify-center gap-1 rounded-[32px] bg-[#18181b] px-4 py-3 w-full cursor-pointer hover:opacity-90 transition-opacity"
          >
            <p className="font-sans text-base font-medium leading-6 text-[#fafafa] whitespace-nowrap">
              3/10 GMs
            </p>
          </button>
        </div>

        {/* グラデーション枠線用の外側のdiv */}
        <div
          className="rounded-[32px] p-[2px]"
          style={{
            background: 'linear-gradient(90deg, #FA9E9E 0%, #FAC79E 14%, #FAF19E 28%, #9EFAC3 42%, #9EFAFA 56%, #99B8FF 70%, #CC9EFA 84%, #FA9ECE 100%)'
          }}
        >
          {/* ボタンのコンテンツ */}
          <button
            onClick={openGM10Modal}
            className="flex items-center justify-center gap-1 rounded-[32px] bg-[#18181b] px-4 py-3 w-full cursor-pointer hover:opacity-90 transition-opacity"
          >
            <p className="font-sans text-base font-medium leading-6 text-[#fafafa] whitespace-nowrap">
              10/10 GMs
            </p>
          </button>
        </div>

        {/* モーダルウィンドウ */}
        <DailyGM3Modal
          isOpen={isGM3ModalOpen}
          onClose={closeGM3Modal}
        />

        <DailyGM10Modal
          isOpen={isGM10ModalOpen}
          onClose={closeGM10Modal}
        />
      </main>
    </div>
  );
}
