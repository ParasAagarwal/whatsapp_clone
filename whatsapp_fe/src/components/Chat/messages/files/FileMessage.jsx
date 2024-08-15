import moment from "moment";
import { TraingleIcon } from "../../../../svg";
import FileImageVideos from "./FileImageVideos";
import FileOthers from "./FileOthers";

export default function FileMessage({ FileMessage, message, me }) {
  const { file, type } = FileMessage;
  return (
    <div
      className={`w-full flex mt-2 space-x-3 max-w-xs ${
        me ? "ml-auto justify-end " : ""
      }`}
    >
      {/* message container */}
      <div>
        <div
          className={`relative h-full dark:text-dark_text_1 p-2 rounded-lg
        ${me ? "bg-green_3" : "dark:bg-dark_bg_2"}
        `}
        >
          {/*Message*/}
          <p className="h-full text-sm">
            {type === "IMAGE" || type === "VIDEO" ? (
              <FileImageVideos url={file.secure_url} type={type} />
            ) : (
              <FileOthers file={file} type={type} me={me} />
            )}
          </p>
          {/*Message Date*/}
          <span className="absolute right-1.5 bottom-1.5 text-xs text-dark_text_5 leading-none">
            {moment(message.createdAt).format("HH:mm")}
          </span>
          {/*Triangle*/}
          {!me ? (
            <span>
              <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
