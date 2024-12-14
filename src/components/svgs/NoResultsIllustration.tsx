import { twMerge } from "tailwind-merge";

interface CheckboxProps {
  className?: string;
}

export default function NoResultsIllustration({
  className,
  ...props
}: CheckboxProps) {
  return (
    <svg
      {...props}
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      width="520"
      height="400"
      className={twMerge(className)}
      viewBox="0 0 520 520"
    >
      <defs>
        <style>
          {
            ".cls-1,.cls-2{fill:#A3A3A3;}.cls-2{opacity:0.2;}.cls-3{opacity:0.3;}"
          }
        </style>
      </defs>
      <title>{"Notioly New"}</title>
      <g id="n.138_Empty_Inbox" data-name="n.138 Empty Inbox">
        <path
          className="cls-1"
          d="M277.6,371.14l-.45-20.4-.22-7.43c-.16-8.75-.26-17.49-.35-26.24,0-3.88-.12-7.78-.18-11.63-.08-4.94-.29-9.91,0-14.85.08-1.54.4-1.34.78,0a24.64,24.64,0,0,1,.6,2.7,21.74,21.74,0,0,1,.36,3.85c.18,10.09.35,20.17.32,30.35,0,6.09.25,12.42.4,18.65q.25,10.26.5,20.54.15,6.32.31,12.64c.15,6.39.3,12.8.45,19.13.16,4.93.32,9.76.48,14.63,0,1.07.09,2.12.1,3.2.06,4-.12,5.29-.59,6.15a3.19,3.19,0,0,1-.33.57c-.37.39-.7-1.25-.86-4.18-.38-8.69-.6-17.86-.84-27.06-.17-6.84-.35-13.71-.53-20.57Z"
        />
        <path
          className="cls-1"
          d="M203.15,420.69l-24-6-8.76-2.16-30.8-8-13.68-3.44c-5.81-1.47-11.69-2.81-17.43-4.57-1.79-.53-1.48-.73.13-.66.81,0,1.94.13,3.3.29a38.31,38.31,0,0,1,4.62.81c11.94,2.76,23.82,5.73,35.75,8.9,7.14,1.89,14.63,3.63,22,5.44l24.21,6,14.91,3.58c7.53,1.78,15.1,3.59,22.61,5.19,5.84,1.26,11.6,2.31,17.41,3.36l3.82.67c4.77.86,6.26,1.29,7.16,2.17a4.21,4.21,0,0,1,.6.59c.36.62-1.67.69-5.2.18-10.49-1.57-21.39-3.93-32.3-6.42-8.1-1.85-16.21-3.82-24.3-5.79Z"
        />
        <path
          className="cls-1"
          d="M345.56,253.17l-24,8.76-8.73,3.25L282,276.36l-3.43,1.25-.86.31c-.3.11-.7.24-1.05.34l-.55.14c-.15,0-.29,0-.44,0l-.9-.09c-2.4-.23-4.84-.4-7.24-.66a89.55,89.55,0,0,1-18.34-3.54c-1.86-.59-1.47-.94.22-.91a55.89,55.89,0,0,1,8.12,1c3.07.59,6.16,1,9.28,1.4s6.22.55,9.45.92c.28-.08.4-.24.62-.3l1.06-.38,2.23-.8,4.48-1.6,9-3.19c7.2-2.52,14.6-5.38,21.91-8.08l24.14-8.9,14.85-5.49c7.49-2.78,15-5.55,22.44-8.38,5.77-2.19,11.37-4.46,17-6.69l3.73-1.49c4.68-1.8,6.22-2.25,7.43-2.1a4,4,0,0,1,.79.1c.59.19-1.18,1.3-4.57,2.7-10.07,4.19-20.82,8.27-31.62,12.32l-24.16,9Z"
        />
        <path
          className="cls-1"
          d="M251.12,307.63c1.18-2.05,2.44-4.05,3.73-6,.48-.71.9-1.47,1.39-2.17a81.7,81.7,0,0,1,5.73-7.11l2.71-3a20.71,20.71,0,0,1,3.8-3.5c.89-.59,1.18,1.85-.15,3.16-2.38,2.38-4.57,4.93-6.92,7.45a43.56,43.56,0,0,0-3.7,5.11c-1.3,1.92-2.52,3.9-3.71,5.91-.72,1.24-1.44,2.49-2.11,3.76-1,1.92-2,3.87-2.9,5.85-.68,1.54-1.17,3.13-1.77,4.68-.13.34-.23.69-.37,1-.52,1.27-.84,1.6-1.52,1.64a2.4,2.4,0,0,1-.46,0c-.48-.06-.62-.72-.38-1.72a39.44,39.44,0,0,1,1.38-4.42c.58-1.46,1.21-2.92,1.91-4.36,1-2.14,2.13-4.25,3.28-6.33Z"
        />
        <path
          className="cls-1"
          d="M172.82,317c-6-1.83-12-3.66-18.07-5.42-2.21-.65-4.43-1.22-6.63-1.86-7.76-2.24-15.55-4.38-23.39-6.34-3.48-.88-7-1.72-10.46-2.53-4.48-1-8.92-2.18-13.31-3.46-1.37-.41-1.12-.62.12-.64a34.42,34.42,0,0,1,6.11.56l3.44.66c1.15.22,2.28.51,3.42.76l6.82,1.62c4.54,1.11,9.14,2.19,13.67,3.5,5.43,1.56,11.13,3,16.68,4.56,6.1,1.73,12.18,3.54,18.25,5.37l11.22,3.37c5.66,1.69,11.34,3.41,17,5,4.39,1.23,8.73,2.31,13.1,3.4l2.87.71c3.59.92,4.69,1.38,5.31,2.14a3.39,3.39,0,0,1,.41.51c.23.52-1.32.49-4-.07-7.9-1.7-16.1-4-24.29-6.36l-18.27-5.42Z"
        />
        <path
          className="cls-1"
          d="M297.21,303a40.35,40.35,0,0,0-2.88-5.12c-.41-.59-.82-1.18-1.26-1.75a50.63,50.63,0,0,0-4.91-5.86,32,32,0,0,0-2.49-2.32c-1.12-.93-2.28-1.8-3.37-2.78-.33-.3-.13-.5.36-.51a3.53,3.53,0,0,1,2,.63,31.45,31.45,0,0,1,6.82,6.06c.58.71,1.19,1.42,1.82,2.11s1.22,1.44,1.78,2.19a43.9,43.9,0,0,1,3.33,5.22c.29.56.6,1.12.89,1.69l.78,1.73A44.46,44.46,0,0,1,302,309.7l.35,1.05.29,1.07c.2.7.43,1.41.6,2.13.06.32.14.63.18,1,.16,1.21,0,1.62-.51,1.91a3.12,3.12,0,0,1-.35.2c-.39.14-.81-.31-1.1-1.13a16.57,16.57,0,0,1-.48-1.84c-.18-.62-.36-1.23-.51-1.86l-.23-.94-.3-.93-.57-1.87c-.33-.92-.66-1.83-1-2.75s-.75-1.81-1.2-2.69Z"
        />
        <path
          className="cls-1"
          d="M356.23,298.32l15-6,5.47-2.23,19.39-7.56c2.88-1.11,5.73-2.31,8.57-3.43a107.81,107.81,0,0,1,11.08-4.05c1.18-.35,1.12,0,.28.67a21.3,21.3,0,0,1-4.49,2.8c-7.35,3.17-14.8,6.07-22.38,8.87-4.53,1.67-9.14,3.68-13.72,5.54L360.35,299l-9.29,3.77c-4.69,1.92-9.41,3.83-14,5.8-3.59,1.54-7.06,3.17-10.58,4.76l-2.32,1.05c-2.92,1.25-3.93,1.46-4.78,1.21a3.08,3.08,0,0,1-.56-.18c-.45-.28.6-1.13,2.68-2.19,6.19-3.08,12.9-5.94,19.64-8.77l15.1-6.22Z"
        />
        <path
          className="cls-1"
          d="M336.08,415.54l8.5-2.65c1-.33,2-.72,3.08-1l11-3.29c1.61-.5,3.23-1.05,4.82-1.59a34.14,34.14,0,0,1,6.31-1.71c.69-.1.64.25.18.73a7.45,7.45,0,0,1-2.48,1.61c-2,.84-4.12,1.49-6.2,2.2s-4.2,1.36-6.33,2c-2.56.73-5.13,1.78-7.7,2.64l-8.53,2.79-5.25,1.72c-2.64.87-5.31,1.71-7.93,2.63-2,.71-4,1.55-6,2.3-.44.16-.87.34-1.32.49-1.68.55-2.28.52-2.82,0a2.58,2.58,0,0,1-.36-.38c-.3-.46.27-1.08,1.43-1.58a115,115,0,0,1,11-4.1l8.53-2.78Z"
        />
        <path
          className="cls-1"
          d="M416.53,368.43s27.1,0,27.1,8.84c0,11.78-52.79,25.58-99.05,36.21l71.52-29.4Z"
        />
        <path
          className="cls-2"
          d="M243.62,191.16c-.24,1.63-.44,82.88-.44,82.88l32.67,4.26,134.57-49.44s5.51-3.73-10.52-6.67Z"
        />
        <path
          className="cls-1"
          d="M93.5,352.51l.13-13.16c0-1.6-.1-3.19-.08-4.79l.16-8.47.21-8.46c0-2.51,0-5,0-7.51a61.36,61.36,0,0,1,.29-9.58c.13-1,.78-.87,1.49,0a8.1,8.1,0,0,1,1.66,4.22l.19,2.44.1,1.21,0,1.22c0,1.63,0,3.25,0,4.88,0,3.26-.08,6.52-.24,9.81-.22,3.92,0,8,0,12v13.25q0,4.08,0,8.16c0,4.12,0,8.26.1,12.34.07,3.18.45,6.29.57,9.44,0,.69.08,1.37.08,2.06a9.52,9.52,0,0,1-.28,2.75,2.4,2.4,0,0,1-1,1.22,3.9,3.9,0,0,1-.57.37c-.32.13-.61-.07-.9-.54a5.29,5.29,0,0,1-.76-2.15c-1-5.6-1-11.5-1.18-17.43-.07-4.41,0-8.84-.08-13.26Z"
        />
        <path
          className="cls-1"
          d="M201.82,418.87l-26-6.64-9.5-2.35L133,401.2c-4.93-1.29-9.92-2.48-14.83-3.71-6.31-1.58-12.68-3-18.88-5-1.94-.6-1.59-.87.18-.86.88,0,2.12.06,3.6.2a35.32,35.32,0,0,1,5,.81c13,2.92,25.83,6.1,38.76,9.55,7.74,2.07,15.86,3.92,23.81,5.88l26.22,6.49,16.15,4c8.15,2,16.33,4,24.46,5.83,6.31,1.43,12.55,2.63,18.82,3.88l4.13.8c5.15,1.07,6.74,1.62,7.66,2.76a4.77,4.77,0,0,1,.6.77c.35.8-1.87.91-5.69.27-11.32-1.92-23.08-4.64-34.88-7.45-8.75-2.09-17.52-4.29-26.28-6.46Z"
        />
        <path
          className="cls-1"
          d="M275.24,371.81q0-11.67-.06-23.36l-.15-8.52-.09-30c0-4.45-.06-8.92-.15-13.33-.06-5.67-.39-11.36.18-17,.15-1.76.69-1.52,1.33,0a21.75,21.75,0,0,1,1,3.09,19.64,19.64,0,0,1,.41,2.08,21.55,21.55,0,0,1,.15,2.33c.18,11.56.37,23.1.13,34.77-.13,7,.17,14.23.25,21.36l.18,23.55v14.49c0,7.32-.11,14.67-.14,21.94,0,5.65.08,11.19,0,16.78,0,1.23,0,2.44,0,3.68-.14,4.6-.53,6.05-1.38,7a4,4,0,0,1-.59.62c-.65.4-1.1-1.49-1.2-4.85-.11-10,0-20.43.07-31,0-7.83.07-15.69,0-23.54Z"
        />
        <path
          className="cls-1"
          d="M380.83,396.24q8.16-3.17,16.28-6.4c2.71-1.08,5.41-2.17,8.09-3.29s5.38-2.25,7.93-3.43l.67-.32s.15,0,.13-.1v-2.78c0-2.13,0-4.26.05-6.39l.85-45c.11-6.66.08-13.36.1-20,0-8.5-.2-17,.45-25.52.19-2.64.92-2.29,1.73-.05a31.11,31.11,0,0,1,1.21,4.64,34.09,34.09,0,0,1,.69,6.62c.08,8.68.23,17.35.08,26s-.36,17.39-.68,26.14c-.38,10.46-.24,21.35-.37,32.05l-.05,4.75,0,1.83v.22a1.18,1.18,0,0,1-.19.11l-.41.2-.81.41-1.45.72-1,.51c-2.72,1.2-5.44,2.38-8.17,3.49-5.45,2.27-10.92,4.45-16.39,6.63l-20.25,7.92-30.66,11.87c-7.89,3.08-15.53,6.32-23.33,9.4-1.71.68-3.37,1.39-5.12,2l-2.24.81c-.69.22-1.33.39-1.91.56-1.17.3-2.13.52-2.93.65a14.19,14.19,0,0,1-2,.21,6,6,0,0,1-1.44-.16,5.84,5.84,0,0,1-1.06-.24c-.37-.19.1-.6,1.17-1.21l2.07-1.15c.86-.46,1.86-.95,3-1.48,1.67-.86,3.42-1.53,5.16-2.25l5.28-2.17L326,417.75c7.22-2.9,14.57-5.78,21.93-8.68l32.88-12.92Z"
        />
        <path
          className="cls-1"
          d="M294.62,274.35,283,278.53l-2.92,1-1.46.52-.37.13-.6.19c-.41.12-.83.22-1.24.3l-.31.05a.63.63,0,0,1-.26,0l-.38-.06-.78-.11-1.55-.23-3.07-.49c-8.18-1.35-16.3-2.83-24.42-4.33-5.93-1.09-11.87-2.11-17.78-3.25q-31.26-6.07-62.37-12.9c-9.2-2-18.45-4-27.56-6.16-5.86-1.36-11.72-2.75-17.54-4.32a130.82,130.82,0,0,1-17.25-5.68c-3.5-1.7-2.57-2.13.56-1.54a153.55,153.55,0,0,1,15.48,3.36c11.77,3.16,23.7,5.88,35.65,8.6s24,5.34,36,8c14.43,3.15,29.56,5.89,44.41,8.65,8.17,1.52,16.34,3,24.52,4.45,4.09.71,8.18,1.42,12.27,2.06l3.06.46.77.11c.25,0,.55.11.63,0a2.16,2.16,0,0,1,.39-.22l.21-.08.37-.13,5.86-2.11,28.84-10.5c14.54-5.34,29.16-10.67,43.55-16.09,11.19-4.21,22.08-8.55,33.09-12.85l7.23-2.85c9.08-3.47,12.05-4.37,14.36-4.18a12.24,12.24,0,0,1,1.52.11c1.11.31-2.34,2.41-8.94,5.09-19.56,8-40.41,15.88-61.38,23.67l-46.91,17.21Z"
        />
        <path
          className="cls-1"
          d="M189.36,209.87q-10.86,3.58-21.7,7.27l-7.88,2.78c-9.29,3.15-18.59,6.29-27.85,9.53-4.11,1.42-8.22,2.94-12.26,4.46l-7.8,3c-2.6,1-5.25,1.83-7.89,2.66-1.66.51-1.63-.07-.47-1.12a24,24,0,0,1,6.42-3.87c10.58-4.09,21.23-8,32.11-11.49,6.51-2.12,13.15-4.67,19.75-7q10.89-3.81,21.82-7.53L197.06,204l20.36-6.86,15.51-5.49c1.15-.38,2.26-.79,3.42-1.16a24.75,24.75,0,0,1,4.68-1.16,3.64,3.64,0,0,1,2.29.33,4.59,4.59,0,0,1,.77.44c.58.59-1,1.63-4.12,2.67-9.15,3.25-18.89,6.6-28.69,9.86l-21.88,7.35Z"
        />
        <path
          className="cls-1"
          d="M346.63,212l-25.56-5.09-9.34-1.73-32.87-6.53c-4.85-1-9.75-1.89-14.59-2.79-3.11-.57-6.23-1.14-9.33-1.76-1.56-.3-3.11-.63-4.66-1s-3.08-.71-4.65-1.23c-2-.62-1.42-1.13.35-1.33a31.41,31.41,0,0,1,8.41.43l19,3.44c3.17.58,6.35,1.2,9.52,1.86l9.52,2c7.6,1.66,15.6,3,23.41,4.47l25.78,5,15.85,3.14,24,4.81c6.18,1.2,12.26,2.26,18.38,3.49,1.35.29,2.67.53,4,.84s2.29.51,3.15.8a20.89,20.89,0,0,1,2.09.8,5.6,5.6,0,0,1,2.11,1.45,5.85,5.85,0,0,1,.56.68c.31.65-1.86.61-5.51,0-10.86-2.08-22.37-4.29-33.89-6.6l-25.78-5.09Z"
        />
        <path
          className="cls-1"
          d="M429.66,246.67a35.13,35.13,0,0,0-3.19-5.35c-.43-.63-1-1.15-1.47-1.76a44.85,44.85,0,0,0-5.63-5.91,25.69,25.69,0,0,0-2.89-2.24c-1.28-.9-2.64-1.65-3.87-2.64-.39-.31-.13-.63.44-.79a3.37,3.37,0,0,1,2.32.24,28.07,28.07,0,0,1,8,5.83c.7.72,1.41,1.44,2.14,2.16a27.8,27.8,0,0,1,2.11,2.23,38,38,0,0,1,3.9,5.5,16.92,16.92,0,0,1,1,1.83c.31.62.64,1.23.93,1.85l1.15,2.94c.31,1,.58,2,.9,3,.28.76.4,1.56.65,2.33l.33,1.17.17.59.1.6c.05.35.13.69.17,1.05.1,1.34-.19,1.77-1,2.06a5.34,5.34,0,0,1-.52.18c-.58.12-1.13-.39-1.47-1.27a10.61,10.61,0,0,1-.49-2c-.14-.66-.37-1.3-.51-2s-.25-1.33-.49-2-.4-1.31-.59-2a36.79,36.79,0,0,0-2.29-5.71Z"
        />
        <path
          className="cls-1"
          d="M298.28,303.1c-.52-1-1-2-1.54-3s-1.14-1.93-1.77-2.86c-.46-.68-1-1.3-1.46-2a63.75,63.75,0,0,0-5.57-6.73,30.94,30.94,0,0,0-2.86-2.64c-1.27-1.05-2.64-2-3.89-3-.39-.3-.19-.64.4-.79a3.41,3.41,0,0,1,2.46.42,30.93,30.93,0,0,1,7.95,6.9c.66.83,1.39,1.61,2.09,2.44s1.45,1.61,2.08,2.49l1.06,1.42c.34.49.65,1,1,1.49l1,1.49.88,1.55c.75,1.26,1.35,2.6,2,3.92a45.16,45.16,0,0,1,2.26,6.24c.13.41.27.81.41,1.22L305,313c.21.83.49,1.65.67,2.49.05.38.14.75.18,1.13.11,1.42-.18,1.89-.91,2.19a4,4,0,0,1-.51.19c-.57.13-1.11-.41-1.45-1.34a17,17,0,0,1-.51-2.08c-.21-.68-.4-1.38-.57-2.08l-.24-1.05-.34-1-.63-2.11c-.41-1-.75-2.06-1.14-3.09s-.89-2-1.38-3Z"
        />
        <path
          className="cls-1"
          d="M357.45,295.47l18.89-7.26,6.87-2.72,24.36-9.15c3.6-1.35,7.18-2.82,10.75-4.2l6.87-2.67,1.74-.63,1.76-.55c1.17-.37,2.37-.7,3.57-1,1.5-.38,1.41.05.36,1-.53.45-1.3,1-2.24,1.65-.47.32-1,.65-1.54,1l-.87.5c-.31.14-.62.28-1,.41l-6.93,2.86c-2.31,1-4.64,1.88-7,2.75q-7,2.69-14.17,5.21c-5.7,2-11.48,4.47-17.23,6.73l-19,7.41L351,301.32c-5.88,2.34-11.81,4.66-17.6,7.09-4.5,1.89-8.84,3.93-13.24,5.92-1,.44-1.9.9-2.88,1.33-3.64,1.57-4.89,1.84-6,1.45a3.61,3.61,0,0,1-.73-.27c-.6-.4.69-1.52,3.27-2.91C321.59,310,330,306.48,338.45,303c6.29-2.57,12.64-5.07,19-7.59Z"
        />
        <path
          className="cls-1"
          d="M80.27,267c.63-1.12,1.24-2.25,1.93-3.33l1-1.63,1.06-1.6c.52-.78,1-1.61,1.52-2.35a57.43,57.43,0,0,1,6.53-7.41c.54-.5,1.05-1,1.58-1.53l1.63-1.49c.67-.65,1.45-1.21,2.19-1.8a9.81,9.81,0,0,1,2.55-1.32c.57-.21.82.52.77,1.43a3.29,3.29,0,0,1-1.13,2.5,99,99,0,0,0-7.83,7,22.82,22.82,0,0,0-2.15,2.52c-.65.91-1.25,1.86-1.91,2.76s-1.36,2.05-2,3.09-1.31,2.1-1.89,3.19l-1.1,2c-.35.68-.67,1.37-1,2.05a49.67,49.67,0,0,0-2.59,6.41,37.56,37.56,0,0,0-1,5.16c-.06.38-.11.75-.16,1.13-.2,1.39-.5,1.8-1.41,2a4.29,4.29,0,0,1-.62.14c-.68.06-1.13-.61-1.17-1.76a16.81,16.81,0,0,1,.07-2.56,15.76,15.76,0,0,1,.37-2.57,40.13,40.13,0,0,1,1.49-5,69.66,69.66,0,0,1,3.2-7.1Z"
        />
        <path
          className="cls-1"
          d="M249.09,306.86c1.46-2.31,3-4.55,4.65-6.77.6-.81,1.13-1.65,1.74-2.44a89.5,89.5,0,0,1,7.1-7.84l3.32-3.3a22.42,22.42,0,0,1,4.59-3.82c.55-.31.91.3.95,1.18a3.54,3.54,0,0,1-1.06,2.73c-2.87,2.63-5.54,5.42-8.45,8.14a44.17,44.17,0,0,0-4.56,5.65c-1.62,2.13-3.13,4.35-4.61,6.59-.88,1.41-1.79,2.79-2.6,4.24-.63,1.09-1.27,2.17-1.86,3.29s-1.19,2.21-1.71,3.35c-.83,1.75-1.41,3.59-2.14,5.36-.15.4-.27.79-.44,1.19-.62,1.45-1,1.82-1.89,1.81a3.83,3.83,0,0,1-.59,0c-.63-.11-.84-.9-.55-2.06a38,38,0,0,1,1.64-5.12c.69-1.68,1.48-3.35,2.33-5,1.25-2.44,2.63-4.85,4.07-7.2Z"
        />
        <path
          className="cls-1"
          d="M169,314.1c-7.55-2.19-15.1-4.37-22.68-6.44-2.76-.76-5.55-1.41-8.32-2.15q-7.31-2-14.65-3.8c-4.87-1.19-9.81-2.23-14.76-3.27-4.39-.92-8.84-1.77-13.2-2.75-1.41-.31-2.81-.65-4.21-1s-2.78-.79-4.16-1.24a65,65,0,0,1-8-3.22c-1.62-.79-1.23-1.06.34-.94a53.46,53.46,0,0,1,7.51,1.25c1.41.32,2.8.66,4.22.94s2.8.67,4.21,1c2.81.64,5.65,1.24,8.5,1.81,5.7,1.16,11.48,2.23,17.24,3.69,6.87,1.79,14,3.37,21,5.22,7.67,2,15.31,4.17,22.93,6.33l14.07,4c7.11,2,14.22,4.1,21.3,6,5.51,1.47,11,2.7,16.43,4,1.21.28,2.4.53,3.61.83,4.49,1.12,5.86,1.71,6.61,2.82a3.6,3.6,0,0,1,.48.75c.27.77-1.7.85-5,.23-9.93-1.92-20.2-4.66-30.48-7.5l-22.91-6.48Z"
        />
        <path
          className="cls-1"
          d="M244.15,244.84l.17-11.76v-4.29l.25-15.12c0-2.23,0-4.48,0-6.7,0-2.85-.06-5.72.21-8.58.16-1.77,1.44.53,1.46,3.8,0,5.81,0,11.62-.26,17.49-.13,3.51,0,7.16-.07,10.75l-.11,11.85c0,2.43-.05,4.86-.08,7.29,0,3.68-.08,7.38-.11,11,0,2.84,0,5.63.07,8.44,0,.62,0,1.23,0,1.86,0,2.32-.39,3-.73,3.52a2.27,2.27,0,0,1-.23.31c-.12.11-.22-.08-.33-.5a11.07,11.07,0,0,1-.3-1.93c-.2-5-.13-10.29-.1-15.6,0-3.94.07-7.9.11-11.86Z"
        />
        <path
          className="cls-1"
          d="M242,241.86l.08-12.67c0-1.54-.08-3.08-.07-4.62l.19-16.3c0-2.41,0-4.84,0-7.24,0-1.54,0-3.08,0-4.63a24.69,24.69,0,0,1,.45-4.71c.35-1.21.87-.62,1.34.18a8,8,0,0,1,1.07,4c0,3.09.09,6.22,0,9.35s-.12,6.28-.26,9.44c-.16,3.79,0,7.72.06,11.59v20.63c0,4,0,8,0,11.9,0,3.06.21,6.07.22,9.13,0,.67,0,1.33,0,2-.07,2.55-.77,3.36-1.46,3.79a1.74,1.74,0,0,1-.45.23c-.21,0-.34-.21-.46-.64-.06-.23-.14-.51-.22-.84a8.32,8.32,0,0,1-.17-1.18c-.26-5.28-.27-11-.3-16.69,0-4.24,0-8.51,0-12.76Z"
        />
        <path
          className="cls-1"
          d="M190.46,210.19l-20.61,7.21-7.48,2.71-26.45,9.41c-3.9,1.41-7.81,2.87-11.66,4.33l-7.44,2.82c-2.48.92-5,1.79-7.5,2.61-1.57.51-1.49.11-.31-.72a33.24,33.24,0,0,1,6.26-3.29c10.1-3.87,20.22-7.64,30.53-11.19,6.16-2.12,12.5-4.55,18.77-6.82l20.72-7.4,12.77-4.49,19.36-6.72c5-1.74,9.83-3.54,14.77-5.24l3.24-1.12c4.1-1.32,5.47-1.54,6.51-1.24a3.22,3.22,0,0,1,.7.22c.52.33-1,1.19-4,2.21L211.28,203l-20.79,7.24Z"
        />
        <path
          className="cls-1"
          d="M291.47,218.71l-8.69-2.1-3.18-.71-11.18-2.64c-1.66-.38-3.33-.73-5-1.06-2.13-.41-4.26-.85-6.39-1.2-.66-.11-.57-.19,0-.23a13.84,13.84,0,0,1,2.9.1c4.41.61,8.78,1.33,13.13,2.31,2.6.62,5.33,1.12,8,1.7l8.8,1.94L295.3,218c2.73.6,5.47,1.24,8.19,1.79,2.11.43,4.21.76,6.3,1.17q.69.12,1.38.27c1.71.4,2.23.63,2.51,1.1a1.3,1.3,0,0,1,.19.31c.11.32-.65.42-1.93.28-1.92-.2-3.85-.51-5.81-.87s-3.91-.83-5.88-1.28l-8.78-2.06Z"
        />
        <path
          className="cls-1"
          d="M283.81,228.69l-3.78-.95-1.38-.31-4.87-1.2c-.72-.17-1.45-.32-2.17-.46a23.57,23.57,0,0,1-2.77-.61c-.56-.18.35-.86,1.41-.65,1.89.38,3.77.8,5.65,1.33,1.12.31,2.32.52,3.48.78l3.82.91,2.35.58,3.55.88c.92.21,1.83.37,2.75.56l.6.12c.74.18,1,.31,1,.63a1.8,1.8,0,0,1,.06.22c0,.23-.34.33-.9.24-1.65-.25-3.34-.67-5-1.09l-3.81-.95Z"
        />
        <path
          className="cls-1"
          d="M381.9,140a13.64,13.64,0,0,1-2,2.89,14.48,14.48,0,0,1-2.73,2.23,18.27,18.27,0,0,1-6.14,2.29,41.25,41.25,0,0,1-4.36.69,58.89,58.89,0,0,0-7.09.91,16.83,16.83,0,0,0-6.22,2.54,11.16,11.16,0,0,0-3.7,4.46,9.08,9.08,0,0,0-.77,3.39,5.61,5.61,0,0,0,.76,3.07c.35.6-.11,1.2-1.27,1.18a2.53,2.53,0,0,1-1-.21,3.1,3.1,0,0,1-1.06-.63,4.35,4.35,0,0,1-1.5-2.66,7.72,7.72,0,0,1,0-2.88,12.75,12.75,0,0,1,.77-2.57,14.76,14.76,0,0,1,2.77-4.33,17.11,17.11,0,0,1,8.54-4.71,92,92,0,0,1,10.75-1.79c3.61-.39,7.14-1.36,9.25-3.91a9.62,9.62,0,0,0,1.59-2.64,13,13,0,0,0,.53-1.52,7,7,0,0,0,.23-1.44c.15-3-1.73-6.13-4.38-8a10.42,10.42,0,0,0-6.79-1.92,9.48,9.48,0,0,0-1.37.29,7.44,7.44,0,0,1-1.8.35,2.64,2.64,0,0,1-1.41-.48,7.8,7.8,0,0,1-.71-.39c-.34-.24-.44-.62-.29-1.21a2.16,2.16,0,0,1,.52-.92,4.87,4.87,0,0,1,1.08-.93,9.4,9.4,0,0,1,4.58-1.29,12.43,12.43,0,0,1,4.67.72,16.41,16.41,0,0,1,7.45,5.52,13.31,13.31,0,0,1,2.75,6.8,11.19,11.19,0,0,1-.33,3.9,17.46,17.46,0,0,1-1.26,3.25Z"
        />
        <path
          className="cls-1"
          d="M345.65,171.21a3.27,3.27,0,0,0,1.34,3.93,3.5,3.5,0,0,0,4-.7,4.3,4.3,0,0,0,.87-4.82,2.75,2.75,0,0,0-2.34-1.59,3.36,3.36,0,0,0-2.59,1.24,1.92,1.92,0,0,0,2.72,2.72,2.4,2.4,0,0,1,.27-.28c-.17.12-.17.13,0,0a1.14,1.14,0,0,1-1.09,0,1,1,0,0,1-.4-.38c.07.14.08.13,0,0s-.07-.16,0,0c0-.29,0-.33,0-.1s0,.2,0,.3c0-.26,0-.27,0-.05s0,.18-.09.27c.13-.28.14-.33.05-.15l-.05.09c-.12.16-.08.12.11-.14l-.14.15c-.15.13-.1.09.16-.12l-.16.1c-.18.09-.11.06.21-.08l-.25.07c.37,0,.46-.05.26,0h-.16c.38.06.47.07.28,0s-.1,0,.25.1c-.28-.14.35.34.15.12.21.3.27.36.16.2.13.34.17.41.1.23s0-.12,0,.23a.81.81,0,0,1,0-.22c-.09.64,0,0,.05-.11a1.92,1.92,0,0,0-3.71-1Z"
        />
        <path
          className="cls-1"
          d="M172.55,103.15a9.6,9.6,0,0,0,1,2.16,10.14,10.14,0,0,0,1.61,1.81,14.14,14.14,0,0,0,4.71,2.46,41.3,41.3,0,0,0,4.2,1,62.86,62.86,0,0,1,8,2.28,22.93,22.93,0,0,1,7.42,4.4,20.67,20.67,0,0,1,2.62,2.9,17.49,17.49,0,0,1,1.92,3.4,11.32,11.32,0,0,1,1,5.12,6.64,6.64,0,0,1-2.62,4.78c-1,.65-1.23-.18-1.29-1.29,0-.27,0-.58-.07-.89,0-.15,0-.3,0-.45s0-.3-.08-.46a12.63,12.63,0,0,1-.24-1.65,10.91,10.91,0,0,0-2.44-6.37,17.29,17.29,0,0,0-6.08-5c-3-1.61-6.82-2.08-10.58-2.9a25.69,25.69,0,0,1-6.37-2.22,14.22,14.22,0,0,1-5.34-4.63,13.32,13.32,0,0,1-1.83-3.94,18.66,18.66,0,0,1-.49-2.06c-.05-.37-.1-.75-.13-1.13a10.63,10.63,0,0,1,0-1.13,11.88,11.88,0,0,1,2.2-6.2,18.06,18.06,0,0,1,4.52-4.46,16.48,16.48,0,0,1,9.33-3.35,10.75,10.75,0,0,1,2.37.26,4.88,4.88,0,0,1,2.78,1.61,1.89,1.89,0,0,1,.4.87,2.49,2.49,0,0,1-.1.93,4.19,4.19,0,0,1-.24.8c-.41.74-1.68.72-3,.46a10.62,10.62,0,0,0-6,.73,14.18,14.18,0,0,0-5.44,3.7,8.79,8.79,0,0,0-2.16,4,5.67,5.67,0,0,0-.09,2,12.73,12.73,0,0,0,.62,2.43Z"
        />
        <path
          className="cls-1"
          d="M200.4,142.31c.09.42-.05-.44,0,.14,0,.36.16-.48,0,0,.15-.32.19-.41.11-.28s0,.06.19-.24c-.15.14-.08.09.22-.16q-.27.15.27-.09c-.46.15.45,0,.12,0s.54.11.18,0,.34.19,0,0l-.18-.11c.26.21.33.26.21.16l-.12-.12c-.14-.15-.1-.1.11.16a1.37,1.37,0,0,1-.13-.2c-.09-.19-.07-.14.06.16,0,0-.12-.42-.12-.42.12.47,0-.13,0-.28,0,.29,0,.32,0,.1-.13.27-.14.31,0,.11s-.26.27-.33.31a1.22,1.22,0,0,1-1.16.06c-.19-.17-.2-.16,0,0a2.92,2.92,0,0,1,.28.32,2.05,2.05,0,0,0,2.9,0,2.12,2.12,0,0,0,0-2.9,3.5,3.5,0,0,0-2.74-1.41,3,3,0,0,0-2.54,1.66,4.63,4.63,0,0,0,.75,5.18,3.75,3.75,0,0,0,3.84,1.08c1.9-.64,2.4-2.6,2-4.37a2.06,2.06,0,0,0-2.52-1.43,2.09,2.09,0,0,0-1.43,2.52Z"
        />
        <g className="cls-3">
          <path
            className="cls-1"
            d="M244.81,99.67c-.24-.47.19-.88,1-1.21a2,2,0,0,1,1.19,0,4.93,4.93,0,0,1,.6.75c.07.15.58,2.59.82,3.4a13.37,13.37,0,0,1,.42,2.41c.19,1.65.46,3.29.72,4.93a5.23,5.23,0,0,1,.06,1.12,13,13,0,0,0,.46,3.78,1.23,1.23,0,0,0,.23.6,18.59,18.59,0,0,1,1,4.1,31.24,31.24,0,0,0,.15,3.36c0,.16.1.31,0,.49-.26.42-.1.72,0,1.06a13.11,13.11,0,0,1,.19,1.42,3,3,0,0,1-.17.79c-.06.24-.55.3-.63.25s-.37.09-.55.17a1.38,1.38,0,0,1-.2.08,8.57,8.57,0,0,1-1-1.22,9.21,9.21,0,0,1-1-1.5s-.37-1-.75-2.09-.73-2.15-.82-2.37a2,2,0,0,1-.07-.74c0-.12-1-3.31-1-3.44a4.92,4.92,0,0,1-.13-2.06.81.81,0,0,0,0-.41,25.66,25.66,0,0,1-.38-3.5c0-.6-.17-1.19-.24-1.79a1.84,1.84,0,0,1,0-.33,1.91,1.91,0,0,0,0-.41c-.21-1.41-.18-2.84-.44-4.26,0-.33.22-1.92.16-2.3C244.38,100.57,244.9,99.86,244.81,99.67Z"
          />
        </g>
        <path
          className="cls-1"
          d="M299.84,150.25c-.06.4-.54.36-1.28.06a2.17,2.17,0,0,1-.8-.71,4.32,4.32,0,0,1-.06-.77c0-.14.86-1.76,1.1-2.34a8,8,0,0,1,.93-1.52c.7-1,1.36-2,2-3a3.47,3.47,0,0,1,.55-.6,8.54,8.54,0,0,0,1.73-2.2.71.71,0,0,0,.16-.44,10,10,0,0,1,1.71-2.61c.71-.51,1.33-1.08,2-1.61.1-.07.15-.19.33-.2a.91.91,0,0,0,.71-.41,7.09,7.09,0,0,1,.82-.71,2.41,2.41,0,0,1,.57-.22c.18-.06.42.23.42.3s.22.2.35.28a.48.48,0,0,1,.14.09,8.4,8.4,0,0,1-.22,1.13c-.12.57-.24,1.16-.29,1.26s-.09.19-.21.45-.3.61-.47,1c-.34.71-.7,1.44-.78,1.59a1.21,1.21,0,0,1-.37.38c-.05.06-1.14,2.15-1.21,2.22-.31.38-.49.85-1,1.08-.1,0-.14.13-.19.22a16.51,16.51,0,0,1-1.59,2c-.28.33-.5.71-.76,1.05,0,.07-.13.1-.19.15s-.17.12-.22.21c-.59.84-1.33,1.56-1.86,2.45-.12.21-1.1.88-1.24,1.12S299.86,150.1,299.84,150.25Z"
        />
        <g className="cls-3">
          <path
            className="cls-1"
            d="M131.41,165.87c-.39-.15-.32-.62,0-1.28.1-.22.59-.65.74-.63a4,4,0,0,1,.79.14c.14,0,1.8,1.34,2.39,1.77a9.63,9.63,0,0,1,1.51,1.41l2.84,3.08a4.12,4.12,0,0,1,.53.76,11.57,11.57,0,0,0,1.92,2.53.85.85,0,0,0,.43.33,11.25,11.25,0,0,1,2.3,2.67c.37.88.81,1.71,1.22,2.56.06.12.18.2.13.39-.1.43.12.62.27.86a6.34,6.34,0,0,1,.55,1.07,2.07,2.07,0,0,1,0,.71c0,.22-.48.46-.56.45-.24,0-.35.22-.51.37l-.18.14a12.3,12.3,0,0,1-2.35-1.37l-1.19-1.28c-.61-.64-1.24-1.3-1.39-1.43a1.46,1.46,0,0,1-.29-.52c0-.07-1.88-2-1.93-2.06a3.54,3.54,0,0,1-.82-1.42.57.57,0,0,0-.17-.28,24.38,24.38,0,0,1-1.63-2.29c-.26-.4-.6-.74-.89-1.12a.88.88,0,0,1-.11-.24,1.35,1.35,0,0,0-.16-.29c-.74-.85-1.34-1.82-2.16-2.6-.19-.18-.75-1.34-1-1.54S131.57,165.93,131.41,165.87Z"
          />
        </g>
        <path
          className="cls-1"
          d="M140,323.48l-5.31-1.22c-.65-.16-1.3-.26-2-.42-2.26-.58-4.52-1.2-6.76-1.83-1-.27-2-.52-3-.76a23,23,0,0,1-3.82-1.06c-.76-.32.64-1.52,2.11-1.2,2.62.59,5.2,1.26,7.78,2.1,1.54.5,3.2.78,4.81,1.14l5.33,1.16,3.29.68c1.67.32,3.34.68,5,1,1.3.22,2.59.35,3.88.55.29,0,.57.06.86.12,1,.22,1.35.43,1.44,1a1.94,1.94,0,0,1,.06.4c0,.43-.51.66-1.28.59a70.06,70.06,0,0,1-7.08-1.11L140,323.53Z"
        />
        <path
          className="cls-1"
          d="M132.58,337.75l-2.57-.57c-.31-.06-.63-.1-.95-.17-1.1-.24-2.21-.52-3.31-.8-.49-.12-1-.23-1.48-.33a6.53,6.53,0,0,1-1.87-.57c-.36-.2.5-1.07,1.16-.87,1.21.33,2.45.63,3.71,1,.75.23,1.56.31,2.35.47l2.6.53,1.61.34,2.42.56c.63.14,1.26.23,1.89.38.14,0,.28.05.41.1.51.17.64.31.63.65,0,.07,0,.15,0,.22,0,.25-.32.36-.69.31-1.1-.16-2.21-.4-3.35-.67l-2.56-.57Z"
        />
      </g>
    </svg>
  );
}