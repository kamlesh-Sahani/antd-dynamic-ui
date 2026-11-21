import React from "react";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  unoptimized?: boolean;
  priority?: boolean;
  sizes?: string;
}

export const Image: React.FC<ImageProps> = ({
  fill,
  unoptimized: _unoptimized,
  priority: _priority,
  sizes: _sizes,
  style,
  className,
  ...props
}) => {
  const fillStyle: React.CSSProperties = fill
    ? { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }
    : {};

  return (
    <img
      style={{ ...fillStyle, ...style }}
      className={className}
      loading={_priority ? "eager" : "lazy"}
      {...props}
    />
  );
};

export default Image;
