import React, { FC } from "react";

interface Props {
  className?: string;
}
const Logo: FC<Props> = ({ className }) => (
  <svg
    className={className}
    width="119"
    height="45"
    viewBox="0 0 119 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="-7.62939e-06" width="119" height="45" fill="url(#pattern0)" />
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_2_40690"
          transform="matrix(0.00625782 0 0 0.0165485 -0.00375469 0.222222)"
        />
      </pattern>
      <image
        id="image0_2_40690"
        width="161"
        height="47"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export default Logo;
