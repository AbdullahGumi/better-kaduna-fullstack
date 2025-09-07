import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  XIcon,
  WhatsappIcon,
} from "react-share";

const SocialShareButtons = ({
  url,
  title,
  label = "Share:",
  className = "mb-6 flex space-x-4 max-w-4xl mx-auto",
  size = 32,
  showLabel = true,
}) => {
  if (!url || !title) {
    return null;
  }

  return (
    <div className={className}>
      {showLabel && (
        <h3 className="text-lg font-semibold text-kaduna-gray">{label}</h3>
      )}
      <TwitterShareButton url={url} title={title}>
        <XIcon size={size} round />
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={size} round />
      </FacebookShareButton>
      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={size} round />
      </WhatsappShareButton>
    </div>
  );
};

export default SocialShareButtons;
