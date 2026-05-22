import DocumentCard from './DocumentCard';

const DocumentList = ({ documents = [] }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {documents.map((doc, idx) => <DocumentCard key={idx} {...doc} />)}
    </div>
  );
};
export default DocumentList;
