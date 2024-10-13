import React from "react";

interface PageProps {
  image?: string;
}

export default function SpacesPage({ image = "/testImage.jpg" }: PageProps) {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    ></div>
  );
}
