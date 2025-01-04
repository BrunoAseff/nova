import type { ReactNode } from "react";

type TabBodyProps = {
  children: ReactNode;
  hasScrollbar?: boolean;
};

const TabBody = ({ children, hasScrollbar = true }: TabBodyProps) => (
  <div
    className={`mt-28 h-[calc(100vh-150px)] w-[130%] min-w-[160%] space-y-4 pb-10 pr-1 md:h-[calc(100vh-200px)] md:w-full md:max-w-[95%] ${
      hasScrollbar
        ? "scrollbar-thin scrollbar-gutter-stable scrollbar-track-background scrollbar-thumb-accent overflow-y-auto pr-2"
        : "overflow-hidden"
    }`}
  >
    {children}
  </div>
);

export default TabBody;
