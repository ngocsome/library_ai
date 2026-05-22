import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, PlusCircle, Loader2 } from 'lucide-react';
import { getGroups } from '../../services/groupService';

const GroupListPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);

      try {
        const data = await getGroups();
        setGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load groups', error);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) => {
    const name = group.Name || group.name || '';
    const description = group.Description || group.description || '';
    const subject = group.Subject || group.subject || '';
    const keyword = searchTerm.toLowerCase();

    return (
      name.toLowerCase().includes(keyword) ||
      description.toLowerCase().includes(keyword) ||
      subject.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="container mx-auto px-6 pt-24 pb-12 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nhóm học tập</h1>
          <p className="text-gray-500 text-sm">
            Kết nối với những người bạn cùng chí hướng
          </p>
        </div>

        <button className="px-4 py-2 bg-brand-green text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm">
          <PlusCircle size={20} />
          Tạo nhóm mới
        </button>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Tìm kiếm nhóm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-brand-green" />
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group, idx) => {
            const groupId = group.GroupID || group.id;
            const name = group.Name || group.name || 'Nhóm học tập';
            const description =
              group.Description ||
              group.description ||
              'Chưa có mô tả cho nhóm này.';
            const subject = group.Subject || group.subject || 'Chung';
            const memberCount =
              group.MemberCount ?? group.memberCount ?? group._count?.GroupMembers ?? 0;
            const isPrivate = group.IsPrivate || group.isPrivate || false;

            return (
              <Link
                to={`/groups/${groupId}`}
                key={groupId || idx}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg">
                    <Users size={24} />
                  </div>

                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {isPrivate ? 'Riêng tư' : 'Công khai'}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {name}
                </h3>

                <p className="text-xs text-brand-green font-medium mb-2">
                  {subject}
                </p>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                  {description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">
                    {memberCount} thành viên
                  </span>

                  <span className="text-sm text-brand-green font-medium group-hover:underline">
                    Tham gia
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          Chưa có nhóm học tập nào.
        </div>
      )}
    </div>
  );
};

export default GroupListPage;