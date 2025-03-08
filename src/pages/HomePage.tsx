import styles from "./HomePage.module.scss";
import Header from "../components/Header.tsx";
import StoryBox from "../components/StoryBox.tsx";
import { useState } from "react";
import StoryViewer from "../components/StoryViewer.tsx";
import { useStoryContext } from "../contexts/StoryContext.tsx";

const HomePage = () => {
  const [openViewer, setOpenViewer] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | undefined>(
    undefined,
  );
  const { state, dispatch } = useStoryContext();

  // Handles marking stories as viewed and switching users
  function sendNextStory() {
    if (selectedUser !== undefined) {
      dispatch({
        type: "MARK_USER_VIEWED",
        user: state.users[selectedUser].user,
      });

      if (selectedUser < state.users.length - 1) {
        setSelectedUser(selectedUser + 1);
      } else {
        setSelectedUser(undefined);
        setOpenViewer(false);
      }
    }
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.storyBoxContainer}>
        {state.users.map((item, index) => (
          <div
            key={item.user}
            onClick={() => {
              setSelectedUser(index);
              setOpenViewer(true);
            }}
          >
            <StoryBox
              userName={item.user}
              imageSrc={item.profilePicture}
              viewed={item.viewCount === item.storyCount}
            />
          </div>
        ))}
      </div>
      {selectedUser !== undefined && (
        <StoryViewer
          open={openViewer}
          onClose={() => setOpenViewer(false)}
          onComplete={sendNextStory}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default HomePage;
