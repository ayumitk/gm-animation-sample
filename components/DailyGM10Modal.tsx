"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import verifiedBadgeAnimation from "../public/lottie/gm-badge.json";
import wavingHandAnimation from "../public/lottie/waving-hand.json";
import confettiAnimation from "../public/lottie/confetti.json";
import ModalWrapper from "./ModalWrapper";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// 画像アセット（Figmaから提供されたURL）
const imgScreenshot = "./bg.png";
const imgStar = "http://localhost:3845/assets/1e39cd256ecb8848072cb7191eb6aae57b77f9a2.svg";
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

    // GMバッジコンポーネント
    const GMBadge = () => (
        <div className="relative w-[57.2px] h-[57.2px] flex items-center justify-center">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[47px] h-[47px]">
                <img src={imgStar} alt="Star" className="w-full h-full" />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="rotate-[345deg]">
                    <p className="font-bold text-sm leading-none text-[#fafafa] text-center whitespace-nowrap">
                        GM!
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            backgroundImage={imgScreenshot}
        >
            <div className="relative">
                {/* コンフェッティのLottie（最前面レイヤー、クリック操作を邪魔しない） */}
                <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
                    <Lottie
                        animationData={confettiAnimation}
                        loop={false}
                        autoplay
                        style={{ width: "100%", height: "100%" }}
                        rendererSettings={{
                            preserveAspectRatio: "xMidYMid slice",
                        }}
                    />
                </div>

                <div ref={modalContainerRef} className="flex flex-col gap-6 px-6 pt-6">
                    {/* タイトルとメッセージ */}
                    <div className="flex flex-col gap-2 items-center justify-center">
                        {/* STAR Point アイコン（SVG） */}
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <img
                                src="/star-point.svg"
                                alt="STAR Point"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h2 className="font-semibold text-2xl leading-8 text-[#09090b] tracking-[-0.6px] whitespace-nowrap">
                            You got 1 STAR Point!
                        </h2>
                        <p className="text-sm leading-6 text-[#09090b] text-center max-w-[342px]">
                            Next GM available in 23 h 45 m
                        </p>
                    </div>

                    {/* 進捗表示とスロット */}
                    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#F4F4F5]/50">
                        <p className="font-medium text-sm leading-5 text-[#09090b] text-center w-full">
                            10/10 GMs — +1 STAR Point earned
                        </p>

                        {/* スロットグリッド */}
                        <div className="grid grid-cols-5 gap-2 w-full">
                            {Array.from({ length: 10 }).map((_, index) => {
                                const slotNumber = index + 1; // 1から10
                                const isSlot10 = slotNumber === 10; // スロット10
                                const isSlot1To9 = slotNumber !== 10; // スロット1〜9

                                return (
                                    <div
                                        ref={index === 0 ? slotRef : null}
                                        key={index}
                                        className="bg-white rounded flex items-center justify-center aspect-square"
                                    >
                                        {/* スロット1と2: 常に静止のSVG画像 */}
                                        {isSlot1To9 && (
                                            <div style={{ width: `${slotSize}px`, height: `${slotSize}px` }}>
                                                <img
                                                    src="/lottie/gm-badge.svg"
                                                    alt="Verified Badge"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        )}

                                        {/* スロット10: Lottieアニメーション */}
                                        {isSlot10 && isReady && (
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
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
}

