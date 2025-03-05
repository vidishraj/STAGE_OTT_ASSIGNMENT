import InstagramSVG from "../assets/InstagramSvg.tsx";

const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "7vh",
        width: "100vw",
        backgroundColor: "whitesmoke",
        borderBottom: "1px solid lightgray",
        flexWrap: "nowrap",
      }}
    >
      <InstagramSVG style={{ height: "100%", width: "35%" }} />{" "}
    </div>
  );
};

export default Header;
