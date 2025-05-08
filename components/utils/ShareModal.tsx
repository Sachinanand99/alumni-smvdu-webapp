"use client";
import React, { useState } from "react";
import { Share, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ShareModal = ({ eventUrl }: { eventUrl: string }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const { toast } = useToast();

    return (
        <>
            <Share className="w-4 h-4 text-gray-600 cursor-pointer" onClick={openModal} />
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-amber-50 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-[40rem] shadow-lg">
                        <div className="flex justify-between">
                            <h3 className="text-lg font-semibold mb-4">Share this Event</h3>
                            <button onClick={closeModal}>
                                <X className="-translate-y-[0.4rem] cursor-pointer" />
                            </button>
                        </div>
                        <hr />
                        <div className="space-y-2 mt-2">
                            <div className="flex items-center justify-between border border-gray-300 p-2 rounded-lg">
                                <span className="text-sm text-gray-700 truncate">{eventUrl}</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(eventUrl);
                                        toast({
                                            title: "Copied!",
                                            description: "Event link copied to clipboard.",
                                            status: "success",
                                        });
                                    }}
                                    className="text-blue-500 cursor-pointer"
                                >
                                    Copy
                                </button>
                            </div>

                            {/* Share Options */}
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 flex items-center gap-x-2"
                                    >
                                        Facebook Post
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`https://wa.me/?text=${eventUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-500 flex items-center gap-x-2"
                                    >
                                        WhatsApp
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${eventUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-800 flex items-center gap-x-2"
                                    >
                                        LinkedIn
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`https://t.me/share/url?url=${eventUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 flex items-center gap-x-2"
                                    >
                                        Telegram
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${eventUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-black flex items-center gap-x-2"
                                    >
                                        X (formerly Twitter)
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShareModal;