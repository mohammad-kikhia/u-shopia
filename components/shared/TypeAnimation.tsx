'use client';

import { useState, useEffect } from 'react';

interface TypeAnimationProps {
  sequence: string[];
  className: string;
  wrapper?: string;
  cursor?: boolean;
  repeat?: number;
}

const TypeAnimation: React.FC<TypeAnimationProps> = ({
  sequence,
  className,
  wrapper = 'span',
  cursor = true,
}) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // deleting currently shown phrase
    if (isDeleting) {
      timeoutId = setTimeout(() => {
        setText(text.slice(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setIndex((index + 1) % sequence.length);
        }
      }, 30);
      // writing a new phrase
    } else if (typeof sequence[index] === 'string') {
      const currentText = sequence[index] as string;
      // while still writing
      if (text !== currentText) {
        timeoutId = setTimeout(
          () => setText(currentText.slice(0, text.length + 1)),
          70,
        );
        // when done writing, start deleting
      } else {
        timeoutId = setTimeout(() => setIsDeleting(true), 1000);
      }
      // select next phrase to write
    } else {
      timeoutId = setTimeout(() => setIndex((index + 1) % sequence.length), 50);
    }

    // clear timeout
    return () => clearTimeout(timeoutId);
  }, [index, isDeleting, sequence, text]);

  // set the wrapper tag as typed by the user
  const Wrapper = wrapper as any;

  return (
    <Wrapper className={className}>
      {text}
      {cursor && <span className="cursor" />}
    </Wrapper>
  );
};

export default TypeAnimation;
