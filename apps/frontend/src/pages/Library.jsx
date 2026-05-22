import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const Library = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-4">
          <h2>Library</h2>
        </main>
      </div>
    </div>
  );
};
export default Library;
