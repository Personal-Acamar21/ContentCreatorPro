import React, { useState } from 'react';
import { X, Link2, Copy, Mail, Twitter, Facebook, Linkedin } from 'lucide-react';
import type { Ebook } from '../../types/ebook';

interface ShareModalProps {
  ebook: Ebook;
  onClose: () => void;
}

export default function ShareModal({ ebook, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(ebook.title);
    const body = encodeURIComponent(`Check out this ebook: ${ebook.title}\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(`Check out this ebook: ${ebook.title}`);
    const url = encodeURIComponent(shareUrl);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Share Ebook</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Link2 className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1 bg-white border rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-1"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleEmailShare}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
            >
              <Mail className="w-5 h-5" />
              Email
            </button>
            <button
              onClick={() => handleSocialShare('twitter')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg"
            >
              <Twitter className="w-5 h-5" />
              Twitter
            </button>
            <button
              onClick={() => handleSocialShare('facebook')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg"
            >
              <Facebook className="w-5 h-5" />
              Facebook
            </button>
            <button
              onClick={() => handleSocialShare('linkedin')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#095196] text-white rounded-lg"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            Share this ebook with your network
          </p>
        </div>
      </div>
    </div>
  );
}