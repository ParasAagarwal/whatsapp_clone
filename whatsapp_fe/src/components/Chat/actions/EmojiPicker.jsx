import EmojiPicker from "emoji-picker-react";
import { CloseIcon, EmojiIcon } from "../../../svg";

export default function EmojiPickerApp({
  textRef,
  message,
  setMessage,
  showPicker,
  setShowPicker,
  setShowAttachments,
}) {
  const handleEmoji = (emojiData, e) => {
    const { emoji } = emojiData; //data from package
    const ref = textRef.current;
    ref.focus();
    const start = message.substring(0, ref.selectionStart);
    const end = message.substring(ref.selectionStart); //here we are trying to achieve the functionality to add the emoji is the place of the cursor so we are breaking text in parts
    const newText = start + emoji + end; //combining text with emoji
    setMessage(newText); //setting that text

    // Set cursor position after the emoji is inserted
    const newCursorPosition = start.length + emoji.length;
    setTimeout(() => {
      ref.setSelectionRange(newCursorPosition, newCursorPosition);
      ref.focus();
    }, 0); //this is for the cursor, as after adding the emoji, the cursor moves to the end; to prevent that and let the cursor pointer stay in the same place
  };

  return (
    <li className="w-full">
      <button
        onClick={() => {
          setShowAttachments(false);
          setShowPicker((prev) => !prev);
        }}
        className="btn"
        type="button"
      >
        {showPicker ? (
          <CloseIcon className="dark:fill-dark_svg_1" />
        ) : (
          <EmojiIcon className="dark:fill-dark_svg_1" />
        )}
      </button>
      {/* Emoji picker */}
      {showPicker ? (
        <div className="openEmojiAnimation absolute bottom-[60px] left-[-0.5px] w-full">
          <EmojiPicker theme="dark" onEmojiClick={handleEmoji} />{" "}
          {/* using emoji-picker-react package */}
        </div>
      ) : null}
    </li>
  );
}
