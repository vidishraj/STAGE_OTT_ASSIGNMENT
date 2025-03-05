import styles from "./HomePage.module.scss";
import Header from "../components/Header.tsx";
import StoryBox from "../components/StoryBox.tsx";
import UserInfo from "../assets/userStories.json";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.storyBoxContainer}>
        {UserInfo.map((item) => (
          <StoryBox userName={item.user} imageSrc={item.profilePicture} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
