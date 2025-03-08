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
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const { state, dispatch } = useStoryContext();

  const user = state.users[selectedUser];
  const imageSrcList = user?.stories || [];
  const userName = user?.user || "";

  useEffect(() => {
    if (!open || imageSrcList.length === 0) return;

    // Set the first unviewed story as the starting index
    const firstUnviewedIndex = imageSrcList.findIndex((img) => !img.viewed);
    setImgIdx(firstUnviewedIndex !== -1 ? firstUnviewedIndex : 0);
  }, [open, selectedUser]);

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
  }, [open, imageSrcList.length, onComplete]);

  function moveStory(clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (imageSrcList.length === 0) return;

    const width = window.innerWidth;
    const xClick = clickEvent.clientX;
    const third = width / 3;

    setImgIdx((prevIdx) => {
      if (xClick < third) {
        return Math.max(0, prevIdx - 1);
      } else if (xClick > 2 * third) {
        if (prevIdx + 1 >= imageSrcList.length) {
          onComplete();
          return prevIdx;
        }
        dispatch({
          type: "MARK_STORY_VIEWED",
          user: userName,
          storyUrl: imageSrcList[prevIdx]?.url,
        });
        return prevIdx + 1;
      }
      return prevIdx;
    });
  }

  if (!open || imageSrcList.length === 0) return null;

  return (
    <div onClick={moveStory} className={styles.storyViewer}>
      <StoryHeader
        intervalId={intervalId}
        userName={userName}
        onClose={onClose}
        profilePictureUrl={user?.profilePicture}
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
