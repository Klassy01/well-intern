import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, User, ExternalLink, Tag } from 'lucide-react';
import { Session } from '../types';
import { useSessions } from '../hooks/useSessions';
import { formatRelativeTime } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const SessionCard: React.FC<{ session: Session }> = ({ session }) => {
  const author = typeof session.user_id === 'object' ? session.user_id : null;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {session.title}
          </h3>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Published
          </span>
        </div>
        
        {session.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {session.description}
          </p>
        )}

        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {session.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
            {session.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{session.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User size={14} className="mr-1" />
              <span>{author?.email || 'Anonymous'}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formatRelativeTime(session.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <a
            href={session.json_file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ExternalLink size={14} className="mr-1" />
            View Session Data
          </a>
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { sessions, loading, error, fetchPublicSessions } = useSessions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetchPublicSessions();
  }, [fetchPublicSessions]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSessions(sessions);
    } else {
      const filtered = sessions.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (session.description && session.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSessions(filtered);
    }
  }, [sessions, searchTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Discover Wellness Sessions
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore curated wellness sessions from our community. Find meditation, yoga, mindfulness, and more.
            </p>
            <Link
              to="/sessions/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <Plus size={20} className="mr-2" />
              Create Your First Session
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search sessions by title, tags, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Published Sessions
            </h2>
            <p className="text-gray-600 mt-1">
              {searchTerm
                ? `${filteredSessions.length} session${filteredSessions.length !== 1 ? 's' : ''} found`
                : `${sessions.length} session${sessions.length !== 1 ? 's' : ''} available`
              }
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Sessions Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No sessions found' : 'No published sessions yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms or browse all sessions.'
                : 'Be the first to share a wellness session with the community!'}
            </p>
            {!searchTerm && (
              <Link
                to="/sessions/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Create Session
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
