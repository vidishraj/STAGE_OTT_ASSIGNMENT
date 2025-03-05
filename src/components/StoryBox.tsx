import styles from "./StoryBox.module.scss";

interface StoryBoxProps {
  imageSrc: string;
  userName: string;
}

const StoryBox: React.FC<StoryBoxProps> = (props) => {
  // A story box will be of fix height and width
  // The container will move and scale accordingly
  const { imageSrc, userName } = props;
  return (
    <div className={styles.storyBox}>
      <img
        className={styles.profilePicture}
        src={imageSrc}
        alt="profile image"
      />
      <span>{userName}</span>
    </div>
  );
};
export default StoryBox;
