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
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const { state, dispatch } = useStoryContext();

  useEffect(() => {
    if (open && selectedUser >= 0 && selectedUser < state.users.length) {
      const user = state.users[selectedUser];
      if (user) {
        setCurrentUserName(user.user || "");
        setImgIdx(0);
        setInitialLoad(true);
      }
    }
  }, [open, selectedUser, state.users]);

  const currentUser = state.users.find((user) => user.user === currentUserName);
  const imageSrcList = currentUser?.stories || [];
  const userName = currentUser?.user || "";

  const currentUserIndex = state.users.findIndex(
    (user) => user.user === currentUserName,
  );

  useEffect(() => {
    if (!open || imageSrcList.length === 0 || !currentUser) return;

    setIsLoading(true);
    setIsImageLoaded(false);

    if (initialLoad) {
      const firstUnviewedIndex = imageSrcList.findIndex((img) => !img.viewed);
      const newImgIdx = firstUnviewedIndex !== -1 ? firstUnviewedIndex : 0;
      setImgIdx(newImgIdx);
      setInitialLoad(false);
    }

    if (
      imgIdx >= 0 &&
      imgIdx < imageSrcList.length &&
      !imageSrcList[imgIdx].viewed
    ) {
      dispatch({
        type: "MARK_STORY_VIEWED",
        user: userName,
        storyUrl: imageSrcList[imgIdx].url,
      });
    }
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [
    open,
    currentUserName,
    imageSrcList.length,
    dispatch,
    userName,
    initialLoad,
    currentUser,
  ]);

  useEffect(() => {
    if (
      !open ||
      imageSrcList.length === 0 ||
      imgIdx < 0 ||
      imgIdx >= imageSrcList.length
    )
      return;

    setIsLoading(true);
    setIsImageLoaded(false);

    const currentStory = imageSrcList[imgIdx];
    if (currentStory && !currentStory.viewed) {
      dispatch({
        type: "MARK_STORY_VIEWED",
        user: userName,
        storyUrl: currentStory.url,
      });
    }

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [imgIdx, open, imageSrcList, dispatch, userName]);
  useEffect(() => {
    if (!open || !isImageLoaded || imageSrcList.length === 0) return;

    const id = setInterval(() => {
      setImgIdx((prevIdx) => {
        if (prevIdx + 1 >= imageSrcList.length) {
          clearInterval(id);

          const allStoriesViewedForCurrentUser = imageSrcList.every(
            (story) => story.viewed,
          );

          if (allStoriesViewedForCurrentUser) {
            dispatch({
              type: "MARK_USER_VIEWED",
              user: userName,
            });
          }

          handleUserComplete();
          return prevIdx;
        }

        return prevIdx + 1;
      });
    }, 5000);

    setIntervalId(id);
    return () => clearInterval(id);
  }, [open, isImageLoaded, imageSrcList, userName, dispatch]);

  const findNextUser = (currentIndex: number) => {
    if (currentIndex < 0 || currentIndex >= state.users.length) {
      return null;
    }

    if (currentIndex + 1 < state.users.length) {
      return state.users[currentIndex + 1];
    }

    return null;
  };

  const findPrevUser = (currentIndex: number) => {
    if (currentIndex <= 0 || currentIndex >= state.users.length) {
      return null;
    }

    return state.users[currentIndex - 1];
  };
  const handleUserComplete = () => {
    imageSrcList.forEach((story) => {
      if (!story.viewed) {
        dispatch({
          type: "MARK_STORY_VIEWED",
          user: userName,
          storyUrl: story.url,
        });
      }
    });

    dispatch({
      type: "MARK_USER_VIEWED",
      user: userName,
    });

    const nextUser = findNextUser(currentUserIndex);

    if (nextUser) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }

      setCurrentUserName(nextUser.user);
      setImgIdx(0);
      setInitialLoad(true); // Reset initialLoad for the new user
    } else {
      // No more users, complete viewing
      onComplete();
    }
  };

  function moveStory(clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (imageSrcList.length === 0) return;

    const width = window.innerWidth;
    const xClick = clickEvent.clientX;
    const third = width / 3;

    // Left third - previous story or user
    if (xClick < third) {
      if (imgIdx === 0) {
        // At first story, try to go to previous user
        const prevUser = findPrevUser(currentUserIndex);
        if (prevUser && prevUser.stories.length > 0) {
          if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
          }

          setCurrentUserName(prevUser.user);
          setImgIdx(prevUser.stories.length - 1);
          setInitialLoad(false); // Don't look for unviewed stories when going back
        }
      } else {
        // Go to previous story
        setImgIdx(Math.max(0, imgIdx - 1));
      }
    }
    // Right third - next story or user
    else if (xClick > 2 * third) {
      if (imgIdx + 1 >= imageSrcList.length) {
        handleUserComplete();
      } else {
        setImgIdx(imgIdx + 1);
      }
    }
  }

  const handleImageLoad = () => {
    setIsLoading(false);
    setIsImageLoaded(true);
  };

  if (!open || !currentUser || imageSrcList.length === 0) return null;

  return (
    <div onClick={moveStory} className={styles.storyViewer}>
      <StoryHeader
        intervalId={intervalId}
        userName={userName}
        onClose={onClose}
        storyCount={currentUser?.storyCount || 0}
        viewCount={currentUser?.viewCount || 0}
        profilePictureUrl={currentUser?.profilePicture}
        currentStoryIndex={imgIdx}
        isLoading={isLoading}
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
