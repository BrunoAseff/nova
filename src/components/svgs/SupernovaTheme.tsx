import { twMerge } from "tailwind-merge";

interface CheckboxProps {
  className?: string;
}

export default function SupernovaTheme({ className, ...props }: CheckboxProps) {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge(className)}
      {...props}
    >
      <path d="m600 60c-297.76 0-540 242.24-540 540s242.24 540 540 540 540-242.24 540-540-242.24-540-540-540zm0 1054.6c-283.74 0-514.59-230.83-514.59-514.59 0-283.74 230.85-514.59 514.59-514.59 283.75 0 514.59 230.84 514.59 514.59 0 283.75-230.83 514.59-514.59 514.59z" />
      <path d="m891.25 207.25c0.22656 1.5352 0.49219 3.0977 0.50391 4.5703 0.070313 10.598-5.207 18.949-14.855 23.543-16.512 7.8242-37.777-4.1641-62.398-18.086-13.332-7.5352-27.098-15.324-40.57-20.113-4.0547-1.4414-7.2969-1.5117-9.9375-0.17969-7.4648 3.6953-12.133 18.289-16.656 32.387-6.2891 19.656-12.793 39.973-29.594 46.164-3.0469 1.1289-6.0977 1.6445-9.1445 1.6445-19.43 0-39.035-21.18-59.617-43.402-14.207-15.348-28.895-31.211-41.699-37.223-12.156-5.6758-24.324 9.6953-41.508 33.816-15.973 22.402-32.496 45.562-54.625 45.562-24.324 0-29.305-24.098-33.695-45.348-5.1133-24.719-9.7578-41.148-27.121-44.062-16.848-2.832-27.109 4.8125-41.426 15.348-14.027 10.344-31.5 23.219-60.434 29.426-22.32 4.8125-35.867 1.3789-40.262-10.129-1.5234-3.9961-1.4766-8.5312-0.44531-13.223-119.46 89.266-196.95 231.78-196.95 392.05 0 162.76 79.969 307.11 202.61 396.09-0.76953-2.8672-1.3672-5.7344-1.5117-8.5312-0.51562-9.6133 3.0469-17.363 10.297-22.391 15.684-10.871 37.668 1.9805 63.109 16.871 13.477 7.8945 27.406 16.055 40.754 20.809 4.0312 1.4141 7.2852 1.5 9.9375 0.16797 7.4648-3.6836 12.133-18.277 16.656-32.387 6.2891-19.656 12.793-39.984 29.594-46.164 22.441-8.3164 44.953 16.02 68.762 41.746 14.207 15.348 28.895 31.223 41.699 37.234 12.133 5.6406 24.312-9.6953 41.52-33.828 15.973-22.391 32.484-45.562 54.625-45.562 24.324 0 29.293 24.098 33.684 45.348 5.1133 24.719 9.7578 41.148 27.121 44.051 16.57 2.832 26.809-4.8125 40.934-15.348 14.113-10.5 31.68-23.578 61.008-29.438 20.867-4.1758 33.898-1.1523 38.652 8.9766 2.1367 4.5586 1.9453 9.9102 0.625 15.336 120.21-89.184 198.29-232.13 198.29-392.98 0-160.7-77.914-303.53-197.93-392.75z" />
      <path d="m869.61 1007.9c5.6641-7.8125 11.629-19.57 9.168-24.816-1.4141-3.0234-8.6406-5.1133-24.672-1.9219-26.531 5.3047-42.133 16.922-55.895 27.168-14.762 10.98-28.691 21.422-50.641 17.676-27.238-4.5703-32.902-31.992-37.465-54.012-4.9453-23.941-8.6523-35.219-21.238-35.219-15.59 0-30.18 20.449-44.281 40.234-17.016 23.879-34.609 48.602-57.254 37.934-15.047-7.0547-30.59-23.855-45.625-40.094-19.945-21.539-40.488-43.777-55.043-38.473-10.992 4.043-16.523 21.371-21.887 38.113-5.5664 17.398-10.824 33.828-23.113 39.898-5.8086 2.8906-12.492 3.0234-19.824 0.39453-14.484-5.1484-28.945-13.609-42.926-21.805-19.859-11.641-40.414-23.688-49.453-17.398-2.2578 1.5586-5.2188 4.4414-4.8594 11.27 0.43359 8.0156 5.125 17.051 9.9492 23.688 76.523 49.645 167.64 78.613 265.45 78.613 99.574 0.039063 192.25-29.949 269.61-81.25z" />
      <path d="m330.77 191.86c-7.5352 8.9414-12.684 19.535-10.68 24.781 1.6914 4.4141 11.555 5.2695 25.715 2.2305 26.258-5.6289 41.82-17.102 55.559-27.227 15.562-11.449 28.98-21.348 51.059-17.652 27.238 4.5703 32.914 31.992 37.465 54.023 4.9453 23.941 8.6523 35.219 21.254 35.219 15.59 0 30.18-20.461 44.281-40.234 17.027-23.867 34.656-48.527 57.254-37.934 15.047 7.0664 30.59 23.855 45.637 40.094 19.957 21.539 40.621 43.848 55.043 38.473 10.98-4.043 16.523-21.371 21.887-38.113 5.5547-17.398 10.824-33.828 23.102-39.91 5.7969-2.8672 12.457-3.0234 19.836-0.40625 14.508 5.1602 28.777 13.223 42.574 21.023 20.664 11.676 40.152 22.715 50.688 17.664 5.2188-2.4844 7.6445-6.2891 7.6094-11.977-0.035156-5.4375-2.4727-11.773-6.2031-17.711-78.004-52.625-171.9-83.379-272.85-83.379-99.422 0-191.94 29.891-269.23 81.035z" />
    </svg>
  );
}