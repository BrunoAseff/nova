/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { Label } from "./label";
import LimitedFeature from "@/components/limitedFeature";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (newFiles: File[]) => {
    setIsModalOpen(true);

    //  setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    // onChange && onChange(newFiles);
  };

  const handleClick = () => {
    setIsModalOpen(true);
    // fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div
      className="my-6 flex w-[145%] justify-between rounded-2xl border-[1px] border-accent/20 bg-accent-foreground md:w-full"
      {...getRootProps()}
    >
      <LimitedFeature
        feature="background uploads"
        limit="background uploads"
        open={isModalOpen}
        onOpenChange={() => setIsModalOpen(!isModalOpen)}
      />
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg px-4 py-2 md:px-10 md:py-4"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="flex items-center">
          <div className="flex w-full flex-col gap-1">
            {" "}
            <Label htmlFor="file-upload" className="text-md text-foreground">
              Upload file
            </Label>
            <p className="hidden text-sm text-muted-foreground md:block">
              Drag or drop your images here or click to upload
            </p>
            <p className="block text-xs text-muted-foreground md:hidden">
              Click here to to upload your own images
            </p>
          </div>
          <div className="relative ml-auto w-full max-w-xl">
            <motion.div
              id="file-upload"
              layoutId="file-upload"
              variants={mainVariant}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className={cn(
                "relative z-40 ml-auto flex h-20 w-full max-w-[5rem] items-center justify-center rounded-2xl border-[1px] border-secondary/40 bg-secondary-smooth-700/10 md:mt-4 md:h-24 md:max-w-[7rem]",
                "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
              )}
            >
              {isDragActive ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-muted-foreground"
                >
                  Drop it
                  <IconUpload className="h-4 w-4 text-muted-foreground" />
                </motion.p>
              ) : (
                <IconUpload className="h-4 w-4 text-muted-foreground" />
              )}
            </motion.div>

            <motion.div
              variants={secondaryVariant}
              className="absolute inset-0 z-30 ml-auto mt-4 flex h-20 w-full max-w-[5rem] items-center justify-center rounded-2xl border border-dashed border-secondary bg-transparent opacity-0 md:h-24 md:max-w-[7rem]"
            ></motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
