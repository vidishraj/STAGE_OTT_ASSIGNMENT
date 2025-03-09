import { useEffect, useState } from "react";
import styles from "./StoryViewer.module.scss";
import StoryHeader from "./StoryHeader.tsx";
import { useStoryContext } from "../contexts/StoryContext.tsx";

interface StoryViewerProps {
  open: boolean;
  onClose: () => void;
  selectedUser: number;
  onComplete: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  open,
  onComplete,
  onClose,
  selectedUser,
}) => {
  const [imgIdx, setImgIdx] = useState<number>(0);
  const [userIdx, setUserIdx] = useState<number>(selectedUser);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { state, dispatch } = useStoryContext();

  const user = state.users[userIdx];
  const imageSrcList = user?.stories || [];
  const userName = user?.user || "";

  useEffect(() => {
    setUserIdx(selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    if (!open || imageSrcList.length === 0) return;

    setIsLoading(true);
    setIsImageLoaded(false);

    const firstUnviewedIndex = imageSrcList.findIndex((img) => !img.viewed);
    setImgIdx(firstUnviewedIndex !== -1 ? firstUnviewedIndex : 0);

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [open, userIdx]);

  useEffect(() => {
    setIsLoading(true);
    setIsImageLoaded(false);

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [imgIdx]);

  useEffect(() => {
    if (!open || !isImageLoaded || imageSrcList.length === 0) return;

    const id = setInterval(() => {
      setImgIdx((prevIdx) => {
        if (prevIdx + 1 >= imageSrcList.length) {
          clearInterval(id);
          onComplete();
          return prevIdx;
        }
        dispatch({
          type: "MARK_STORY_VIEWED",
          user: userName,
          storyUrl: imageSrcList[prevIdx]?.url,
        });
        return prevIdx + 1;
      });
    }, 5000);

    setIntervalId(id);
    return () => clearInterval(id);
  }, [
    open,
    isImageLoaded,
    imageSrcList.length,
    onComplete,
    userIdx,
    userName,
    dispatch,
  ]);

  function moveStory(clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (imageSrcList.length === 0) return;

    const width = window.innerWidth;
    const xClick = clickEvent.clientX;
    const third = width / 3;

    if (xClick < third) {
      if (imgIdx === 0) {
        if (userIdx > 0) {
          const prevUserIdx = userIdx - 1;
          const prevUser = state.users[prevUserIdx];
          if (prevUser && prevUser.stories.length > 0) {
            if (intervalId) {
              clearInterval(intervalId);
              setIntervalId(null);
            }

            setUserIdx(prevUserIdx);
            setImgIdx(prevUser.stories.length - 1);
          }
        }
      } else {
        setImgIdx(Math.max(0, imgIdx - 1));
      }
    }
    // Right third of the screen
    else if (xClick > 2 * third) {
      if (imgIdx + 1 >= imageSrcList.length) {
        if (userIdx < state.users.length - 1) {
          // Go to next user
          const nextUserIdx = userIdx + 1;

          if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
          }

          setUserIdx(nextUserIdx);
          setImgIdx(0);
        } else {
          onComplete();
        }
      } else {
        dispatch({
          type: "MARK_STORY_VIEWED",
          user: userName,
          storyUrl: imageSrcList[imgIdx]?.url,
        });
        setImgIdx(imgIdx + 1);
      }
    }
  }

  const handleImageLoad = () => {
    setIsLoading(false);
    setIsImageLoaded(true);
  };

  if (!open || imageSrcList.length === 0) return null;

  return (
    <div onClick={moveStory} className={styles.storyViewer}>
      <StoryHeader
        intervalId={intervalId}
        userName={userName}
        onClose={onClose}
        storyCount={user?.storyCount || 0}
        viewCount={user?.viewCount || 0}
        profilePictureUrl={user?.profilePicture}
        currentStoryIndex={imgIdx}
        isLoading={isLoading} // Pass loading state to StoryHeader
      />

      {isLoading && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}

      {imageSrcList[imgIdx] && (
        <img
          className={`${styles.story} ${isImageLoaded ? styles.loaded : styles.hidden}`}
          src={imageSrcList[imgIdx].url}
          alt="userStory"
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
};

export default StoryViewer;
