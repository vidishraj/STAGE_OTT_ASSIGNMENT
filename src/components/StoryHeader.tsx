import React from "react";
import style from "./StoryHeader.module.scss";
import CloseIcon from "./CloseIcon.tsx";

interface StoryHeaderProps {
  intervalId: NodeJS.Timeout | null;
  userName: string;
  onClose: () => void;
  profilePictureUrl: string;
  storyCount: number;
  viewCount: number;
  currentStoryIndex: number;
  isLoading?: boolean; // Add loading state prop
  onStoryBarClick?: (index: number) => void; // Optional click handler for direct navigation
}

const StoryHeader: React.FC<StoryHeaderProps> = (props) => {
  const {
    userName,
    onClose,
    profilePictureUrl,
    storyCount,
    currentStoryIndex,
    onStoryBarClick,
    isLoading = false, // Default to false if not provided
    intervalId,
  } = props;

  const renderLoadingBars = () => {
    const bars = [];
    for (let i = 0; i < storyCount; i++) {
      // Updated logic for bar status:
      // 1. Stories before currentStoryIndex are viewed
      // 2. Current story is in progress only if not loading
      // 3. Stories after currentStoryIndex are unviewed, regardless of their actual viewed status
      const isViewed = i < currentStoryIndex;
      const isCurrent = i === currentStoryIndex;
      const isUnviewed = i > currentStoryIndex;

      const handleClick = () => {
        if (onStoryBarClick) {
          onStoryBarClick(i);
        }
      };

      let barStatus;
      if (isViewed) {
        barStatus = style.viewed;
      } else if (isCurrent) {
        // Only apply the current (animating) style if the image is loaded and timer is active
        barStatus = isLoading
          ? style.paused
          : intervalId
            ? style.current
            : style.paused;
      } else if (isUnviewed) {
        barStatus = style.unviewed;
      }

      bars.push(
        <div
          key={`story-bar-${i}`}
          className={`${style.loadingBar} ${barStatus}`}
          onClick={handleClick}
        ></div>,
      );
    }
    return bars;
  };

  return (
    <div className={style.header}>
      <div className={style.loadingBarsContainer}>{renderLoadingBars()}</div>
      <div className={style.infoLine}>
        <div className={style.pictureUsername}>
          <img
            src={profilePictureUrl}
            alt={"user profile"}
            className={style.headerPicture}
          />
          <p style={{ color: "white" }}>{userName}</p>
          <p style={{ color: "darkgrey" }}> 11h</p>
        </div>
        <div style={{ padding: "2px 10px", color: "white" }} onClick={onClose}>
          <CloseIcon />
        </div>
      </div>
    </div>
  );
};

export default StoryHeader;
