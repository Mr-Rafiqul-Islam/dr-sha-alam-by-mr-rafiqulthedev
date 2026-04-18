"use client";
import React, { useState, useRef, useEffect } from "react";

// Single Reusable Accordion Component
const Accordion = ({
  data,
  type,
  collapsible,
  defaultValue,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
}) => {
  data = data || [];
  type = type || "single";
  collapsible = collapsible !== undefined ? collapsible : true;
  defaultValue = defaultValue || null;
  className = className || "";
  itemClassName = itemClassName || "";
  triggerClassName = triggerClassName || "";
  contentClassName = contentClassName || "";
  const [openItems, setOpenItems] = useState(() => {
    if (defaultValue !== null) {
      return type === "single" ? [defaultValue] : defaultValue;
    }
    return [];
  });

  const toggleItem = (index) => {
    if (type === "single") {
      if (openItems.includes(index)) {
        setOpenItems(collapsible ? [] : openItems);
      } else {
        setOpenItems([index]);
      }
    } else {
      setOpenItems((prev) =>
        prev.includes(index)
          ? prev.filter((item) => item !== index)
          : [...prev, index]
      );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {data.map((item, index) => (
        <AccordionItem
          key={index}
          index={index}
          question={item.question}
          answer={item.answer}
          isOpen={openItems.includes(index)}
          onToggle={() => toggleItem(index)}
          itemClassName={itemClassName}
          triggerClassName={triggerClassName}
          contentClassName={contentClassName}
        />
      ))}
    </div>
  );
};

// Internal AccordionItem Component
const AccordionItem = (props) => {
  const {
    index,
    question,
    answer,
    isOpen,
    onToggle,
    itemClassName,
    triggerClassName,
    contentClassName,
  } = props;
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className={`border-b border-gray-200 ${itemClassName}`}>
      {/* Trigger */}
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-between py-4 px-1 text-left font-medium transition-all hover:underline ${triggerClassName}`}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <svg
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content */}
      <div
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={contentRef} className={`pb-4 px-1 pt-0 ${contentClassName}`}>
          {answer}
        </div>
      </div>
    </div>
  );
};

// Demo Component
export default function AccordionDemo() {
  // Example data arrays
  const faqData = [
    {
      question: "Is it accessible?",
      answer:
        "Yes. It adheres to the WAI-ARIA design pattern with proper ARIA attributes and keyboard navigation support.",
    },
    {
      question: "Is it styled?",
      answer:
        "Yes. It comes with default styles using Tailwind CSS that you can customize to match your design system.",
    },
    {
      question: "Is it animated?",
      answer:
        "Yes. It uses smooth CSS transitions for opening and closing with dynamic height calculations for seamless animations.",
    },
  ];

  const techData = [
    {
      question: "How do I use this component?",
      answer:
        "Simply pass an array of objects with 'question' and 'answer' keys. The component handles all the logic internally!",
    },
    {
      question: "Can I customize the styles?",
      answer:
        "Absolutely! The component accepts className props for the container, items, triggers, and content areas.",
    },
    {
      question: "What are the available props?",
      answer: (
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>data:</strong> array of {`{ question, answer }`} objects
            (required)
          </li>
          <li>
            <strong>type:</strong> 'single' or 'multiple' - controls behavior
          </li>
          <li>
            <strong>collapsible:</strong> boolean - allows closing all items
          </li>
          <li>
            <strong>defaultValue:</strong> number or array - initially open
            items
          </li>
          <li>
            <strong>className:</strong> string - custom classes for container
          </li>
          <li>
            <strong>itemClassName:</strong> string - custom classes for items
          </li>
          <li>
            <strong>triggerClassName:</strong> string - custom classes for
            triggers
          </li>
          <li>
            <strong>contentClassName:</strong> string - custom classes for
            content
          </li>
        </ul>
      ),
    },
    {
      question: "Can I use React components in answers?",
      answer:
        "Yes! As you can see above, you can pass any React element as the answer, including JSX with lists, images, or other components.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Simple Accordion Component
          </h1>
          <p className="text-gray-600">
            Just pass an array of questions and answers!
          </p>
        </div>

        {/* Single Type Accordion */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Single Mode (one open at a time)
          </h2>
          <Accordion
            data={faqData}
            type="single"
            collapsible
            defaultValue={0}
          />
        </div>

        {/* Multiple Type Accordion */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Multiple Mode (many open at once)
          </h2>
          <Accordion data={techData} type="multiple" defaultValue={[0, 2]} />
        </div>

        {/* Custom Styled Accordion */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Custom Styled
          </h2>
          <Accordion
            data={[
              {
                question: "Can I change colors?",
                answer: "Yes! Use className props to customize every part.",
              },
              {
                question: "Does it work with gradients?",
                answer:
                  "As you can see, it works beautifully with any background!",
              },
            ]}
            type="single"
            collapsible
            itemClassName="border-white/20"
            triggerClassName="text-white hover:text-white/80"
            contentClassName="text-white/90"
          />
        </div>

        {/* Usage Example */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📝 Usage Example
          </h3>
          <pre className="bg-blue-100 text-blue-900 p-4 rounded text-sm overflow-x-auto">
            {`const data = [
  {
    question: "Your question here?",
    answer: "Your answer here"
  },
  {
    question: "Another question?",
    answer: <div>Can use JSX too!</div>
  }
];

<Accordion 
  data={data}
  type="single"
  collapsible
  defaultValue={0}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export { Accordion };
