const DocumentCard = ({ title, author }) => {
  return (
    <div className="border p-4 rounded">
      <h3>{title}</h3>
      <p>{author}</p>
    </div>
  );
};
export default DocumentCard;
