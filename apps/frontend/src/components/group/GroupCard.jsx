const GroupCard = ({ name, description }) => {
  return (
    <div className="border p-4 rounded shadow-sm">
      <h3 className="text-xl">{name}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
export default GroupCard;
