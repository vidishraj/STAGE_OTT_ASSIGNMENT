import InstagramSV from "../assets/Instagram_logo.svg?url";

const InstagramSVG = (
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
) => {
  return <img src={InstagramSV} alt={"Logo"} {...props}></img>;
};

export default InstagramSVG;
