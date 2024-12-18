import React from "react";

export default function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="bg-gradient-to-br from-[#1AECFF] via-[#57ABFF] to-[#D1E9FF] bg-clip-text text-5xl font-medium tracking-tight text-transparent sm:text-[5rem]">
      {children}
    </h1>
  );
}
