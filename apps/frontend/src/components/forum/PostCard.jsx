const PostCard = ({ title, content }) => {
  return (
    <div className="border-b p-4">
      <h4 className="font-bold">{title}</h4>
      <p>{content}</p>
    </div>
  );
};
export default PostCard;
