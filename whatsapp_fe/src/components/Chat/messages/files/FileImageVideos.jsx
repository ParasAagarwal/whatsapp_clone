export default function FileImageVideos({ url, type }) {
  return (
    <div className="z-20">
      {type === "IMAGE" ? (
        <img src={url} alt="" className="cursor-pointer" />
      ) : (
        <video src={url} controls className="cursor-pointer"></video>
      )}
    </div>
  );
}
