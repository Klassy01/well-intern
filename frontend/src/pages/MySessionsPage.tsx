import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, ExternalLink, Calendar, Tag, Search, FileText, Eye } from 'lucide-react';
import { Session } from '../types';
import { useSessions } from '../hooks/useSessions';
import { formatRelativeTime } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

interface SessionCardProps {
  session: Session;
  onDelete: (id: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(session._id);
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'published'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {session.title}
          </h3>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(session.status)}`}>
            {session.status === 'published' ? 'Published' : 'Draft'}
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

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar size={14} className="mr-1" />
          <span>Updated {formatRelativeTime(session.updated_at)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              to={`/sessions/${session._id}/edit`}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Edit3 size={14} className="mr-1" />
              Edit
            </Link>
            
            <a
              href={session.json_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <ExternalLink size={14} className="mr-1" />
              View
            </a>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Session
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{session.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MySessionsPage: React.FC = () => {
  const { sessions, loading, error, fetchMySessions, deleteSession } = useSessions();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetchMySessions();
  }, [fetchMySessions]);

  useEffect(() => {
    let filtered = sessions;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (session.description && session.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const draftCount = sessions.filter(s => s.status === 'draft').length;
  const publishedCount = sessions.filter(s => s.status === 'published').length;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
              <p className="text-gray-600 mt-2">
                Manage your wellness sessions, drafts, and published content
              </p>
            </div>
            <Link
              to="/sessions/new"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              New Session
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <FileText size={24} className="mr-3" />
                <div>
                  <p className="text-blue-100">Total Sessions</p>
                  <p className="text-2xl font-bold">{sessions.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <Edit3 size={24} className="mr-3" />
                <div>
                  <p className="text-yellow-100">Drafts</p>
                  <p className="text-2xl font-bold">{draftCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <Eye size={24} className="mr-3" />
                <div>
                  <p className="text-green-100">Published</p>
                  <p className="text-2xl font-bold">{publishedCount}</p>
                </div>
              </div>
            </div>
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
                  placeholder="Search your sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? `${filteredSessions.length} session${filteredSessions.length !== 1 ? 's' : ''} found`
              : `Showing all ${sessions.length} session${sessions.length !== 1 ? 's' : ''}`
            }
          </p>
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
              <SessionCard
                key={session._id}
                session={session}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No sessions found' : 'No sessions yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first wellness session to get started!'}
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Link
                to="/sessions/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Create First Session
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySessionsPage;
