"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  backgroundImage?: string;
}

export default function ModalWrapper({ isOpen, onClose, children, backgroundImage }: ModalWrapperProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50"
          onClick={onClose}
        >
          {/* オーバーレイ（背景の暗い部分） */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[rgba(9,9,11,0.5)] backdrop-blur-sm"
          ></motion.div>
          
          {/* モーダルコンテンツ（下部からスライドアップ） */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 border border-[#f4f4f5] rounded-t-2xl max-w-[390px] mx-auto overflow-hidden"
            style={{
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor:'#ffffff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col pb-12 pt-0 px-0 relative" id="modal-container">
              {/* 閉じるボタン */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
                >
                  <img src="./x.svg" alt="Close" className="w-6 h-6" />
                </button>
              </div>

              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

