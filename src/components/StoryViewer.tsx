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
  const { state, dispatch } = useStoryContext();

  const user = state.users[userIdx];
  const imageSrcList = user?.stories || [];
  const userName = user?.user || "";

  useEffect(() => {
    setUserIdx(selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    if (!open || imageSrcList.length === 0) return;

    const firstUnviewedIndex = imageSrcList.findIndex((img) => !img.viewed);
    setImgIdx(firstUnviewedIndex !== -1 ? firstUnviewedIndex : 0);

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [open, userIdx]);

  useEffect(() => {
    if (!open || imageSrcList.length === 0) return;

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
  }, [open, imageSrcList.length, onComplete, userIdx, userName]);

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
    } else if (xClick > 2 * third) {
      if (imgIdx + 1 >= imageSrcList.length) {
        if (userIdx < state.users.length - 1) {
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
      />
      {imageSrcList[imgIdx] && (
        <img
          className={styles.story}
          src={imageSrcList[imgIdx].url}
          alt="userStory"
        />
      )}
    </div>
  );
};

export default StoryViewer;
