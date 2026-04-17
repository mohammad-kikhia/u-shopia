// this functions aims to replace the <Trans /> component from i18n
// "because the new app router is weird!!"
// it takes the translation string, and an object of elements
// ex: trans(dictionary.title, {span: <span className="test" />})
// json file translation ex: "Hello {span}World{span}"
// returns: "Hello <span className="test">World</span>

import React, { ReactElement } from 'react';

export function trans(
  translation: string,
  components: { [key: string]: ReactElement },
) {
  const parts = translation.split(/({.*?}.*?{.*?})/g);
  return parts.map((part, i) => {
    if (part.startsWith('{') && part.endsWith('}')) {
      const [start, content, end] = part
        .split(/({.*?}|{.*?})/g)
        .filter(Boolean);
      const keyStart = start.slice(1, -1);
      const keyEnd = end.slice(1, -1);

      if (keyStart === keyEnd) {
        return React.cloneElement(components[keyStart], { key: i }, content);
      }
    }

    return part;
  });
}
