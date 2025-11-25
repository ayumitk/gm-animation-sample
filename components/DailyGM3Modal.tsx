"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import verifiedBadgeAnimation from "../public/lottie/gm-badge.json";
import wavingHandAnimation from "../public/lottie/waving-hand.json";
import ModalWrapper from "./ModalWrapper";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 画像アセット（Figmaから提供されたURL）
const imgScreenshot = "./bg.png";
const imgGift = "./gift.svg";

export default function Modal({ isOpen, onClose }: ModalProps) {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [slotSize, setSlotSize] = useState<number>(80); // デフォルト値
  const [initialAnimationSize, setInitialAnimationSize] = useState<string>('80vw'); // 初期アニメーションサイズ
  const [isReady, setIsReady] = useState(false); // モーダルの横幅が取得できてアニメーション開始可能か
  const slotRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // モーダルが開かれたときに状態をリセット
  useEffect(() => {
    if (isOpen) {
      setIsAnimationComplete(false);
      setIsReady(false); // 横幅取得前にリセット
    }
  }, [isOpen]);

  // モーダルの幅を取得して初期アニメーションサイズを計算
  useEffect(() => {
    if (isOpen && modalContainerRef.current) {
      const updateInitialSize = () => {
        // モーダルラッパー（親要素）の幅を取得
        const modalWrapper = modalContainerRef.current?.closest('[class*="max-w"]') as HTMLElement;
        if (modalWrapper) {
          const modalWidth = modalWrapper.getBoundingClientRect().width;
          if (modalWidth > 0) {
            const size = modalWidth * 0.8; // モーダル幅の80%
            setInitialAnimationSize(`${size}px`);
            setIsReady(true); // 横幅が取得できたらアニメーション開始可能に
          }
        }
      };

      // 少し遅延させてDOMが完全にレンダリングされた後に取得
      const timer = setTimeout(updateInitialSize, 0);
      window.addEventListener('resize', updateInitialSize);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateInitialSize);
      };
    }
  }, [isOpen]);

  // スロットのサイズを取得
  useEffect(() => {
    if (slotRef.current) {
      const updateSlotSize = () => {
        const rect = slotRef.current?.getBoundingClientRect();
        if (rect) {
          // 幅と高さの小さい方をサイズとして使用
          const size = Math.min(rect.width, rect.height);
          setSlotSize(size);
        }
      };

      updateSlotSize();
      window.addEventListener('resize', updateSlotSize);
      
      return () => {
        window.removeEventListener('resize', updateSlotSize);
      };
    }
  }, [isOpen]);

  return (
    <ModalWrapper 
      isOpen={isOpen} 
      onClose={onClose}
      backgroundImage={imgScreenshot}
    >
      <div ref={modalContainerRef} className="flex flex-col gap-6 px-6 pt-6">
            {/* タイトルとメッセージ */}
            <div className="flex flex-col gap-2 items-center justify-center">
              {/* 手を振るLottieアニメーション */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <Lottie
                  animationData={wavingHandAnimation}
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                  rendererSettings={{
                    preserveAspectRatio: "xMidYMid slice",
                  }}
                />
              </div>
              <h2 className="font-semibold text-2xl leading-8 text-[#09090b] tracking-[-0.6px] whitespace-nowrap">
                GM sent!
              </h2>
              <p className="text-sm leading-6 text-[#09090b] text-center max-w-[342px]">
                Next GM available in 23 h 45 m
              </p>
            </div>

            {/* 進捗表示とスロット */}
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#F4F4F5]/50">
              <p className="font-medium text-sm leading-5 text-[#09090b] text-center w-full">
                3 / 10 GMs — 1 STAR Point at 10
              </p>
              
              {/* スロットグリッド */}
              <div className="grid grid-cols-5 gap-2 w-full">
                {Array.from({ length: 10 }).map((_, index) => {
                  const slotNumber = index + 1; // 1から10
                  const isSlot1Or2 = slotNumber === 1 || slotNumber === 2; // スロット1と2
                  const isSlot3 = slotNumber === 3; // スロット3
                  const isSlot4To10 = slotNumber >= 4 && slotNumber <= 10; // スロット4〜10
                  
                  return (
                    <div 
                      ref={index === 0 ? slotRef : null}
                      key={index}
                      className="bg-white rounded flex items-center justify-center aspect-square"
                    >
                      {/* スロット1と2: 常に静止のSVG画像 */}
                      {isSlot1Or2 && (
                        <div style={{ width: `${slotSize}px`, height: `${slotSize}px` }}>
                          <img 
                            src="/lottie/gm-badge.svg" 
                            alt="Verified Badge" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      
                      {/* スロット3: Lottieアニメーション */}
                      {isSlot3 && isReady && (
                        <motion.div
                          className={isAnimationComplete ? "absolute z-20" : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"}
                          initial={{ width: initialAnimationSize, height: initialAnimationSize }}
                          animate={{ 
                            width: isAnimationComplete ? `${slotSize}px` : initialAnimationSize,
                            height: isAnimationComplete ? `${slotSize}px` : initialAnimationSize,
                            scale: isAnimationComplete ? [1, 1.2, 0.9, 1] : 1
                          }}
                          transition={{ 
                            duration: isAnimationComplete ? 0.4 : 0.5,
                            ease: isAnimationComplete ? [0.34, 1.56, 0.64, 1] : "easeOut",
                            scale: {
                              duration: 0.7,
                              times: [0, 0.3, 0.7, 1],
                              ease: [0.34, 1.56, 0.64, 1]
                            }
                          }}
                        >
                          <Lottie 
                            animationData={verifiedBadgeAnimation} 
                            loop={false}
                            autoplay={true}
                            style={{ width: '100%', height: '100%' }}
                            rendererSettings={{
                              preserveAspectRatio: 'xMidYMid slice',
                            }}
                            onComplete={() => {
                              setIsAnimationComplete(true);
                            }}
                          />
                        </motion.div>
                      )}
                      
                      {/* スロット4〜10: 空のスロット表示（数字またはギフトアイコン） */}
                      {isSlot4To10 && (
                        <>
                          {index < 9 ? (
                            <p className="text-sm text-[#a1a1aa] whitespace-nowrap relative z-10">{slotNumber}</p>
                          ) : (
                            <img src={imgGift} alt="Gift" className="w-5 h-5 relative z-10" />
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
      </div>
    </ModalWrapper>
  );
}

