import React, { useState, createContext, useContext } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

interface AccordionItemProps {
  value: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  title,
  children,
}) => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }

  const { openItems, toggleItem } = context;
  const isOpen = openItems.includes(value);

  return (
    <div className="border-b">
      <button
        className="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline"
        onClick={() => toggleItem(value)}
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="pb-4 pt-0">{children}</div>}
    </div>
  );
};

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  type = "single",
  collapsible = false,
  className = "",
  children,
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    if (type === "single") {
      setOpenItems(openItems.includes(value) && collapsible ? [] : [value]);
    } else {
      setOpenItems(
        openItems.includes(value)
          ? openItems.filter((item) => item !== value)
          : [...openItems, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};

export { AccordionItem };
