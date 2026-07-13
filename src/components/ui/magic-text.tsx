"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface MagicTextProps {
  text: string;
  className?: string;
  textClassName?: string;
}

interface WordProps {
  children: string;
  progress: any;
  range: number[];
  textClassName?: string;
}

const Word: React.FC<WordProps> = ({ children, progress, range, textClassName = "" }) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className={`relative mt-[12px] mr-1 ${textClassName}`}>
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({
  text,
  className = "",
  textClassName = "font-display",
}) => {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");

  return (
    <p ref={container} className={`flex flex-wrap leading-[0.5] p-4 ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;

        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]} textClassName={textClassName}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default MagicText;
