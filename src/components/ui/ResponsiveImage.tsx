import type { FC, ImgHTMLAttributes } from "react";
import clsx from "clsx";
import * as styles from "./ResponsiveImage.css";

type ResponsiveImageProps = ImgHTMLAttributes<HTMLImageElement>;

/**
 * Image that scales to fill its container's inline size while keeping
 * its native aspect ratio. Block-size is left to the browser so the
 * image never crops or stretches.
 *
 * Plain `<img>` under the hood — pass any standard image attribute
 * (`src`, `alt`, `loading`, …) straight through.
 */
export const ResponsiveImage: FC<ResponsiveImageProps> = ({
  className,
  alt = "",
  ...rest
}) => <img className={clsx(styles.root, className)} alt={alt} {...rest} />;
