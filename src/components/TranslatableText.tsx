import React from "react";
import { useTranslate } from "../hooks/useTranslate";

interface TranslatableTextProps {
  text: string | undefined | null;
  className?: string;
  as?: React.ElementType;
}

export const TranslatableText: React.FC<TranslatableTextProps> = ({
  text,
  className = "",
  as: Component = "span",
}) => {
  const { text: displayText, isLoading } = useTranslate(text);

  return (
    <Component className={`${className} ${isLoading ? "opacity-80 transition-opacity" : ""}`}>
      {displayText}
    </Component>
  );
};
