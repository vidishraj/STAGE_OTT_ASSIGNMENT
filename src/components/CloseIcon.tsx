const CloseIcon = ({ className = "", size = 24, ...props }) => {
  return (
    <svg
      aria-label="Close"
      className={className}
      fill="currentColor"
      height={size}
      role="img"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      <title>Close</title>
      <polyline
        fill="none"
        points="20.643 3.357 12 12 3.353 20.647"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      ></polyline>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        x1="20.649"
        x2="3.354"
        y1="20.649"
        y2="3.354"
      ></line>
    </svg>
  );
};

export default CloseIcon;
