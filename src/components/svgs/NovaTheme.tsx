import { twMerge } from "tailwind-merge";

interface CheckboxProps {
  className?: string;
}

export default function NovaTheme({ className, ...props }: CheckboxProps) {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge(className)}
      {...props}
    >
      <path d="m1090.8 665.34c31.598-19.746 49.234-41.844 49.234-65.34s-17.641-45.59-49.238-65.336c17.934-15.195 27.762-31.555 27.762-48.695 0-21.664-15.594-42.082-43.625-60.465 1.9297-5.1016 3.0117-10.289 3.0117-15.559 0-22.137-17.527-42.875-48.773-61.203 0.45703-2.3867 0.74609-4.793 0.74609-7.2188 0-23.367-21.531-45.016-59.219-63.465 0.23047-1.6406 0.4375-3.2852 0.4375-4.957 0-26.457-29.355-48.695-75.988-65.965 0.070313-0.82031 0.21484-1.6289 0.21484-2.457 0-29.172-43.863-51.984-107.05-66.809 0.042969-0.54688 0.26953-1.0586 0.26953-1.6133 0-31.648-71.949-50.715-150.25-55.43 1.1602-1.5508 1.875-3.3164 1.875-5.3867-0.003906-14.699-33.465-15.441-40.176-15.441s-40.172 0.74219-40.172 15.438c0 2.0703 0.71484 3.8359 1.875 5.3867-78.305 4.7148-150.25 23.781-150.25 55.43 0 0.55469 0.22266 1.0664 0.26953 1.6133-63.188 14.824-107.05 37.637-107.05 66.809 0 0.83203 0.14453 1.6406 0.21484 2.4609-46.637 17.27-75.988 39.508-75.988 65.961 0 1.6758 0.20312 3.3203 0.4375 4.9609-37.684 18.449-59.215 40.094-59.215 63.461 0 2.4258 0.28906 4.832 0.74609 7.2188-31.246 18.328-48.773 39.066-48.773 61.203 0 5.2734 1.082 10.457 3.0117 15.559-28.027 18.383-43.625 38.801-43.625 60.465 0 17.141 9.8242 33.5 27.758 48.695-31.602 19.75-49.238 41.844-49.238 65.34s17.637 45.594 49.234 65.34c-17.934 15.195-27.758 31.555-27.758 48.695 0 21.664 15.594 42.082 43.625 60.465-1.9297 5.1016-3.0117 10.289-3.0117 15.562 0 22.133 17.527 42.871 48.773 61.195-0.45703 2.3906-0.74609 4.793-0.74609 7.2188 0 23.367 21.531 45.016 59.215 63.465-0.23047 1.6406-0.4375 3.2891-0.4375 4.9609 0 26.449 29.355 48.688 75.988 65.953-0.070312 0.82031-0.21484 1.6328-0.21484 2.4609 0 29.172 43.863 51.984 107.05 66.809-0.042968 0.54688-0.26953 1.0625-0.26953 1.6172 0 31.645 71.945 50.711 150.25 55.426-1.1602 1.5508-1.875 3.3203-1.875 5.3867 0 14.703 33.461 15.445 40.172 15.445s40.172-0.74219 40.172-15.438c0-2.0703-0.71875-3.8359-1.875-5.3867 78.301-4.7148 150.25-23.781 150.25-55.426 0-0.55469-0.22266-1.0703-0.26953-1.6172 63.184-14.824 107.05-37.637 107.05-66.809 0-0.83203-0.14453-1.6406-0.21484-2.4609 46.637-17.266 75.988-39.504 75.988-65.953 0-1.6758-0.20312-3.3203-0.4375-4.957 37.688-18.449 59.219-40.098 59.219-63.469 0-2.4258-0.28906-4.832-0.74609-7.2188 31.246-18.328 48.773-39.062 48.773-61.195 0-5.2734-1.082-10.461-3.0156-15.562 28.031-18.383 43.625-38.805 43.625-60.465 0.007813-17.152-9.8164-33.508-27.75-48.703zm37.367-65.34c0 20.398-17.047 39.938-47.211 57.676-31.723-22.656-82.176-42.379-146.27-57.68 64.09-15.297 114.54-35.02 146.27-57.676 30.164 17.742 47.211 37.281 47.211 57.68zm-528.13 422.33c-18.551 0-36.535-0.39062-53.984-1.0938 16.766-1.4336 34.828-2.2461 53.984-2.2461s37.223 0.80859 53.984 2.2461c-17.449 0.70312-35.434 1.0938-53.984 1.0938zm110.12 6.9961c30.801 6.5508 52.391 15.488 61.52 24.742-46.105 9.543-104.39 15.652-171.64 15.652s-125.54-6.1094-171.64-15.652c9.1289-9.2539 30.719-18.191 61.52-24.742 35.891 3.1914 73.125 4.8711 110.12 4.8711s74.234-1.6797 110.12-4.8711zm-110.12-22.203c-38.691 0-78.336 3.5938-111.28 10.484-69.281-6.1055-126.9-17.691-169.12-32.051 4.875-8.7461 16.074-17.398 32.906-25.422 69.559 13.879 154.62 21.965 247.5 21.965s177.94-8.0859 247.49-21.961c16.828 8.0234 28.027 16.676 32.902 25.418-42.219 14.359-99.836 25.945-169.12 32.051-32.941-6.8906-72.586-10.484-111.28-10.484zm0-36.891c-86.961 0-163.96-7-227.45-18.387 33.578-12.145 80.82-22.051 138.59-27.148 28.738 1.4883 58.402 2.3047 88.863 2.3047s60.125-0.8125 88.863-2.3047c57.766 5.0977 105.01 15 138.59 27.148-63.496 11.387-140.49 18.387-227.45 18.387zm-248.46-22.438c-43.707-8.9414-80.086-20.02-107.8-32.277 4.3281-8.6289 13.465-17.211 26.934-25.426 50.867 13.73 112.5 24.223 181.41 30.445-39.598 6.5234-74.605 15.699-100.54 27.258zm396.37-27.258c68.906-6.2188 130.54-16.715 181.41-30.445 13.473 8.2148 22.605 16.801 26.934 25.43-27.719 12.258-64.098 23.336-107.8 32.277-25.934-11.562-60.938-20.738-100.54-27.262zm-61.66-7.6836c-28.133-2.4883-57.281-3.793-86.25-3.793s-58.117 1.3047-86.25 3.793c-86-4.5273-164.43-15.629-227.4-31.219 25.25-12.145 60.281-23.113 103.44-31.676 63.965 7.9062 134.95 12.301 210.21 12.301s146.25-4.3945 210.21-12.305c43.16 8.5625 78.191 19.531 103.44 31.68-62.969 15.59-141.39 26.691-227.39 31.219zm-417.21-35.734c-33.535-9.1758-61.957-19.684-83.984-31.156 4.9219-10.504 15.883-20.965 32.305-30.953 39.637 12.297 86.629 22.605 139.18 30.426-35.273 8.6055-65.406 19.219-87.504 31.684zm164.71-34.609c48.414-6.9258 104.39-11.031 166.25-11.031s117.84 4.1055 166.25 11.031c-52.352 5.0742-108.33 7.8828-166.25 7.8828s-113.9-2.8086-166.25-7.8828zm409.7 2.9297c52.555-7.8242 99.547-18.129 139.18-30.426 16.422 9.9844 27.383 20.449 32.305 30.953-22.027 11.473-50.449 21.984-83.988 31.16-22.094-12.469-52.23-23.086-87.5-31.688zm-35.195-7.6016c-62.254-11.863-135.73-18.23-208.26-18.23s-146.01 6.3633-208.26 18.23c-60.082-7.5352-114.18-18.164-159.32-31.086 51.598-25.723 140.29-47.145 254.46-55.84 36.387 2.1328 74.199 3.2695 113.12 3.2695s76.727-1.1367 113.11-3.2695c114.18 8.6953 202.87 30.117 254.47 55.84-45.137 12.926-99.242 23.555-159.32 31.086zm-591.96-35.918c-30.465-9.5664-56.18-20.234-76.105-31.711 12.961-20.77 45.797-39.984 92.875-56.172 53.414 13.98 117.04 24.836 187.69 31.719-88.91 11.449-160.84 31.258-204.46 56.164zm562.93-56.164c70.652-6.8828 134.28-17.738 187.69-31.723 47.078 16.188 79.918 35.402 92.879 56.172-19.926 11.48-45.637 22.145-76.105 31.711-43.621-24.906-115.55-44.711-204.46-56.16zm-67.57-6.8242c-35.504-2.6484-72.895-4.0703-111.66-4.0703s-76.16 1.4219-111.66 4.0664c-87.121-5.2852-166.87-16.574-232.79-32.102 86.008-25.52 209.63-41.84 344.45-41.84s258.45 16.32 344.46 41.84c-65.922 15.531-145.67 26.816-232.79 32.105zm-111.66-85.812c-148.8 0-279.62 18.562-366.62 48.203-41.371-10.883-76.309-23.523-103.02-37.414 34.621-22.758 91.707-42.668 163.46-57.605 85.273 17.586 190.72 27.879 306.18 27.879 115.46 0 220.91-10.293 306.18-27.875 71.75 14.938 128.84 34.844 163.46 57.605-26.715 13.891-61.648 26.531-103.02 37.414-87-29.645-217.82-48.207-366.62-48.207zm0-475.45c18.57 0 36.57 0.39062 54.039 1.0938-16.781 1.4375-34.863 2.25-54.039 2.25s-37.258-0.8125-54.035-2.25c17.465-0.70312 35.469-1.0938 54.035-1.0938zm-110.14-6.9961c-30.797-6.5508-52.379-15.484-61.504-24.738 46.105-9.543 104.39-15.652 171.64-15.652s125.54 6.1094 171.65 15.656c-9.125 9.25-30.707 18.188-61.504 24.738-35.895-3.1953-73.137-4.875-110.14-4.875s-74.246 1.6758-110.14 4.8711zm110.14 22.207c38.699 0 78.352-3.5977 111.3-10.488 69.273 6.1055 126.88 17.691 169.1 32.051-4.875 8.7461-16.078 17.402-32.914 25.426-69.555-13.875-154.61-21.961-247.48-21.961s-177.93 8.0859-247.49 21.961c-16.84-8.0234-28.039-16.68-32.918-25.426 42.215-14.359 99.824-25.945 169.1-32.051 32.949 6.8945 72.605 10.488 111.3 10.488zm0 36.898c86.957 0 163.95 7 227.44 18.387-33.57 12.141-80.789 22.043-138.53 27.141-28.754-1.4961-58.43-2.3086-88.91-2.3086s-60.156 0.81641-88.91 2.3086c-57.742-5.0977-104.96-15-138.54-27.141 63.492-11.391 140.49-18.387 227.45-18.387zm248.45 22.43c43.711 8.9375 80.094 20.02 107.81 32.277-4.3281 8.6289-13.457 17.211-26.922 25.426-50.863-13.73-112.5-24.227-181.4-30.449 39.59-6.5195 74.582-15.695 100.51-27.254zm-396.38 27.254c-68.906 6.2227-130.54 16.719-181.4 30.449-13.465-8.2148-22.594-16.797-26.922-25.426 27.719-12.258 64.102-23.336 107.81-32.277 25.926 11.559 60.922 20.734 100.51 27.254zm61.645 7.6875c28.148 2.4883 57.309 3.793 86.293 3.793 28.98 0 58.145-1.3086 86.289-3.7969 85.992 4.5273 164.41 15.629 227.38 31.219-25.246 12.148-60.281 23.121-103.45 31.684-63.969-7.9062-134.95-12.301-210.22-12.301-75.27 0-146.25 4.3945-210.22 12.305-43.164-8.5625-78.195-19.535-103.45-31.684 62.965-15.59 141.39-26.691 227.38-31.219zm417.26 35.73c33.535 9.1758 61.949 19.684 83.977 31.156-4.9219 10.504-15.887 20.969-32.309 30.957-39.633-12.297-86.629-22.602-139.18-30.422 35.27-8.6055 65.41-19.223 87.508-31.691zm-164.71 34.621c-48.414 6.9219-104.39 11.031-166.25 11.031s-117.84-4.1055-166.25-11.031c52.352-5.0781 108.33-7.8828 166.25-7.8828s113.9 2.8047 166.25 7.8828zm-409.71-2.9297c-52.551 7.8242-99.539 18.129-139.18 30.422-16.426-9.9883-27.387-20.449-32.309-30.953 22.027-11.473 50.441-21.984 83.973-31.156 22.102 12.465 52.238 23.082 87.512 31.688zm35.195 7.5977c62.258 11.867 135.73 18.23 208.27 18.23 72.527 0 146.01-6.3672 208.26-18.23 60.078 7.5312 114.18 18.16 159.31 31.082-51.605 25.723-140.31 47.145-254.5 55.836-36.371-2.1289-74.164-3.2656-113.07-3.2656s-76.699 1.1367-113.07 3.2695c-114.2-8.6953-202.89-30.113-254.5-55.836 45.129-12.926 99.23-23.551 159.31-31.086zm591.96 35.914c30.469 9.5664 56.188 20.234 76.113 31.715-12.957 20.77-45.797 39.988-92.875 56.172-53.422-13.984-117.06-24.844-187.73-31.727 88.926-11.445 160.86-31.254 204.49-56.16zm-562.89 56.16c-70.664 6.8828-134.3 17.742-187.73 31.727-47.078-16.188-79.914-35.406-92.875-56.172 19.926-11.48 45.645-22.145 76.113-31.715 43.629 24.906 115.56 44.715 204.49 56.16zm67.582 6.8281c35.488 2.6445 72.867 4.0664 111.62 4.0664 38.758 0 76.133-1.4219 111.62-4.0664 87.141 5.2852 166.91 16.574 232.84 32.109-86.008 25.52-209.64 41.84-344.46 41.84-134.82 0-258.46-16.32-344.46-41.844 65.934-15.531 145.7-26.82 232.84-32.105zm111.62 85.82c148.8 0 279.62-18.562 366.63-48.207 41.367 10.879 76.301 23.52 103.01 37.41-34.621 22.758-91.707 42.664-163.46 57.602-85.277-17.586-190.73-27.879-306.18-27.879-115.46 0-220.91 10.293-306.18 27.875-71.75-14.938-128.84-34.844-163.46-57.602 26.711-13.891 61.641-26.527 103.01-37.406 87 29.641 217.83 48.207 366.63 48.207zm0 30.793c99.785 0 193.87 8.2734 273.31 22.312-79.445 14.043-173.53 22.316-273.31 22.316s-193.87-8.2734-273.31-22.312c79.445-14.043 173.53-22.316 273.31-22.316zm506.66-91.719c0 14.766-9.3984 29.062-26.414 42.504-24.668-13.738-56.266-26.219-93.664-37.074 40.973-16.094 69.789-34.953 83.039-55.574 23.754 15.613 37.039 32.547 37.039 50.145zm-40.613-76.023c0 3.0938-0.59375 6.1602-1.4688 9.207-18.383-10.637-41.059-20.508-67.461-29.445 13.469-9.3984 23.043-19.414 28.234-29.891 26.023 15.441 40.695 32.418 40.695 50.129zm-48.027-68.422c0 0.35156-0.085937 0.70312-0.10156 1.0508-20.109-10.402-44.809-19.922-73.371-28.371 10.562-7.6406 18.227-15.875 22.52-24.664 32.902 16.309 50.953 34.344 50.953 51.984zm-58.82-68.77c-25.578-11.164-57.359-20.992-94.004-29.148 12.789-7.5625 21.992-15.941 26.637-25.078 42.969 16.238 67.074 35.488 67.367 54.227zm-76.082-69.824c-38.676-12.852-87.328-22.602-140.33-28.875 20.039-6.7344 34.957-15.215 41.703-25.375 60.637 14.113 96.605 34.457 98.625 54.25zm-283.11-131.06c12.344 0 21.246 1.8789 25.73 3.5703-4.4844 1.6914-13.387 3.5703-25.73 3.5703s-21.25-1.8789-25.73-3.5703c4.4805-1.6914 13.387-3.5703 25.73-3.5703zm0 19.633c102.46 0 174.2 22.836 176.46 43.738-51.707-10.93-114.52-16.824-176.46-16.824-61.945 0-124.76 5.8945-176.46 16.824 2.2695-20.902 74.008-43.738 176.46-43.738zm-184.49 57.176c6.7461 10.156 21.664 18.641 41.703 25.375-53.004 6.2734-101.66 16.023-140.34 28.879 2.0234-19.797 37.992-40.141 98.633-54.254zm-107.35 69.848c4.6406 9.1406 13.848 17.516 26.637 25.078-36.645 8.1523-68.426 17.984-94.004 29.148 0.29297-18.734 24.398-37.984 67.367-54.227zm-126.18 123c0-17.641 18.051-35.676 50.949-51.98 4.293 8.7891 11.957 17.023 22.52 24.664-28.562 8.4453-53.254 17.969-73.367 28.367-0.015626-0.34766-0.10156-0.69922-0.10156-1.0508zm-48.027 68.422c0-17.711 14.676-34.688 40.695-50.129 5.1914 10.477 14.762 20.492 28.234 29.891-26.402 8.9375-49.078 18.809-67.461 29.445-0.875-3.0469-1.4688-6.1133-1.4688-9.207zm-40.613 76.023c0-17.598 13.285-34.531 37.039-50.145 13.25 20.621 42.062 39.48 83.035 55.574-37.398 10.855-68.996 23.34-93.664 37.074-17.012-13.441-26.41-27.734-26.41-42.504zm-21.477 114.04c0-20.398 17.047-39.938 47.211-57.676 31.723 22.656 82.172 42.379 146.26 57.676-64.09 15.297-114.54 35.02-146.26 57.68-30.164-17.742-47.211-37.281-47.211-57.68zm21.477 114.04c0-14.766 9.3984-29.059 26.41-42.504 24.672 13.738 56.27 26.219 93.672 37.078-40.973 16.094-69.789 34.953-83.039 55.57-23.758-15.613-37.043-32.547-37.043-50.145zm40.613 76.027c0-3.0977 0.59375-6.1602 1.4688-9.207 18.383 10.633 41.055 20.504 67.453 29.441-13.469 9.3945-23.039 19.41-28.227 29.887-26.023-15.438-40.695-32.414-40.695-50.121zm48.027 68.418c0-0.35156 0.085937-0.70312 0.10156-1.0547 20.113 10.398 44.809 19.922 73.375 28.371-10.566 7.6406-18.23 15.875-22.527 24.668-32.898-16.309-50.949-34.344-50.949-51.984zm58.812 68.77c25.578 11.164 57.355 20.996 93.996 29.148-12.785 7.5625-21.988 15.938-26.629 25.074-42.973-16.234-67.074-35.484-67.367-54.223zm76.082 69.82c38.68 12.852 87.34 22.602 140.35 28.875-20.043 6.7344-34.965 15.219-41.715 25.379-60.645-14.109-96.617-34.457-98.633-54.254zm283.12 131.06c-12.344 0-21.25-1.8789-25.73-3.5703 4.4805-1.6914 13.387-3.5703 25.73-3.5703s21.246 1.8789 25.73 3.5703c-4.4844 1.6914-13.387 3.5703-25.73 3.5703zm0-19.633c-102.47 0-174.21-22.84-176.46-43.734 51.707 10.93 114.52 16.82 176.46 16.82s124.76-5.8945 176.46-16.824c-2.2539 20.898-73.992 43.738-176.46 43.738zm184.48-57.176c-6.75-10.16-21.672-18.645-41.715-25.379 53.008-6.2734 101.66-16.023 140.34-28.875-2.0156 19.797-37.984 40.141-98.629 54.254zm107.35-69.852c-4.6406-9.1367-13.844-17.512-26.629-25.074 36.641-8.1523 68.418-17.984 93.996-29.148-0.29688 18.742-24.402 37.988-67.367 54.223zm126.18-122.99c0 17.641-18.055 35.68-50.953 51.984-4.293-8.7891-11.961-17.027-22.527-24.668 28.566-8.4453 53.266-17.969 73.379-28.371 0.015626 0.35156 0.10156 0.70312 0.10156 1.0547zm48.027-68.418c0 17.707-14.676 34.684-40.695 50.121-5.1875-10.477-14.762-20.492-28.227-29.891 26.398-8.9375 49.074-18.809 67.453-29.441 0.875 3.0508 1.4688 6.1172 1.4688 9.2109zm3.5703-25.883c-13.25-20.621-42.066-39.48-83.043-55.574 37.406-10.859 69.004-23.34 93.676-37.078 17.012 13.445 26.41 27.738 26.41 42.504 0 17.602-13.285 34.535-37.043 50.148z" />
    </svg>
  );
}