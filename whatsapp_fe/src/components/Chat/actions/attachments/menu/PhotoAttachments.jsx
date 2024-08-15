import { useDispatch } from "react-redux";
import { PhotoIcon } from "../../../../../svg";
import { useRef } from "react";
import { addFiles } from "../../../../../features/chatSlice";

export default function PhotoAttachments() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const imageHandler = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((img) => {
      if (
        img.type !== "image/png" &&
        img.type !== "image/jpeg" &&
        img.type !== "image/gif" &&
        img.type !== "image/webp"
      ) {
        files.filter((item) => item.name !== img.name);
        return;
      } else if (img.size > 1024 * 1024 * 5) {
        files = files.filter((item) => item.name !== img.name);
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = (e) => {
          dispatch(
            addFiles({ file: img, imgData: e.target.result, type: "image" })
          );
        };
      }
    });
  };
  return (
    <li>
      <button
        type="button"
        className="bg-[#BF59CF] rounded-full"
        onClick={() => inputRef.current.click()}
      >
        <PhotoIcon />
      </button>
      <input
        type="file"
        hidden
        ref={inputRef}
        accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/mpeg"
        onChange={imageHandler}
      />
    </li>
  );
}
