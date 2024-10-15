import React from "react";

interface SpaceBackgroundProps {
  image?: string;
}

const SpaceBackground: React.FC<SpaceBackgroundProps> = ({
  image = "/testImage.jpg",
}) => {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    ></div>
  );
};

export default SpaceBackground;
