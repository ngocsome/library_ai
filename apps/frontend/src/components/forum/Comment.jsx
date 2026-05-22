const Comment = ({ user, text }) => {
  return (
    <div className="ml-4 p-2 bg-gray-50 mt-2">
      <span className="font-semibold">{user}: </span>
      <span>{text}</span>
    </div>
  );
};
export default Comment;
