import React from "react";
import style from "./StoryHeader.module.scss";

interface StoryHeaderProps {
  intervalId: NodeJS.Timeout | null;
  userName: string;
  onClose: () => void;
  profilePictureUrl: string;
  storyCount: number;
  viewCount: number;
  currentStoryIndex: number;
}

const StoryHeader: React.FC<StoryHeaderProps> = (props) => {
  const {
    userName,
    onClose,
    profilePictureUrl,
    storyCount,
    viewCount,
    currentStoryIndex,
  } = props;

  const renderLoadingBars = () => {
    const bars = [];
    for (let i = 0; i < storyCount; i++) {
      const barStatus =
        i < viewCount && i !== currentStoryIndex
          ? style.loaded
          : i === currentStoryIndex
            ? style.loading
            : style.notLoaded;

      bars.push(
        <div
          key={`story-bar-${i}`}
          className={`${style.loadingBar} ${barStatus}`}
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
        <p onClick={onClose} style={{ color: "white" }}>
          X
        </p>
      </div>
    </div>
  );
};

export default StoryHeader;
