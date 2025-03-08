import style from "./StoryHeader.module.scss";

interface StoryHeaderProps {
  intervalId: NodeJS.Timeout | null;
  userName: string;
  onClose: () => void;
  profilePictureUrl: string;
}

const StoryHeader: React.FC<StoryHeaderProps> = (props) => {
  const { userName, onClose, profilePictureUrl } = props;
  return (
    <div className={style.header}>
      <div className={style.loadingBar}></div>
      <div className={style.infoLine}>
        <div className={style.pictureUsername}>
          <img
            src={profilePictureUrl}
            alt={"use profile"}
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
