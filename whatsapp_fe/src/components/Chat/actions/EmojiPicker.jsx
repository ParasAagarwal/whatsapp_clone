import React from 'react'
import { EmojiIcon } from '../../../svg';

export default function EmojiPickerApp() {
  return (
    <li className="w-full">
      <button className="btn" type="button">
        <EmojiIcon className="dark:fill-dark_svg_1" />
      </button>
      {/* Emoji picker */}
    </li>
  );
}
