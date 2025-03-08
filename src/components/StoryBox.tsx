import styles from "./StoryBox.module.scss";

interface StoryBoxProps {
  imageSrc: string;
  userName: string;
  viewed: boolean;
}

const StoryBox: React.FC<StoryBoxProps> = (props) => {
  // A story box will be of fix height and width
  // The container will move and scale accordingly
  const { imageSrc, userName, viewed } = props;
  return (
    <div className={styles.storyBox}>
      <img
        style={{ border: viewed ? "1px solid grey" : "1px solid red" }}
        className={styles.profilePicture}
        src={imageSrc}
        alt="profile image"
      />
      <span>{userName}</span>
    </div>
  );
};
export default StoryBox;
