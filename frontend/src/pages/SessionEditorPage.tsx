import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Send, ArrowLeft, Loader2, Clock, CheckCircle } from 'lucide-react';
import { SessionFormData } from '../types';
import { useSessions, useAutoSave } from '../hooks/useSessions';
import { apiClient } from '../utils/api';
import { formatRelativeTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const SessionEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<SessionFormData>({
    title: '',
    tags: [],
    json_file_url: '',
    description: '',
  });
  
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { saveDraft, publishSession } = useSessions();

  // Auto-save functionality
  const { isSaving, lastSaved } = useAutoSave(
    formData,
    async (data) => {
      if (data.title.trim() && data.json_file_url.trim()) {
        await saveDraft({ ...data, id });
      }
    },
    5000 // 5 seconds
  );

  // Load existing session if editing
  useEffect(() => {
    if (isEditing && id) {
      loadSession(id);
    }
  }, [id, isEditing]);

  const loadSession = async (sessionId: string) => {
    try {
      setInitialLoading(true);
      const response = await apiClient.getSession(sessionId);
      
      if (response.success && response.data) {
        const session = response.data.session;
        setFormData({
          id: session._id,
          title: session.title,
          tags: session.tags,
          json_file_url: session.json_file_url,
          description: session.description || '',
        });
        setTagsInput(session.tags.join(', '));
      }
    } catch (error: any) {
      toast.error('Failed to load session');
      navigate('/my-sessions');
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (!formData.json_file_url.trim()) {
      newErrors.json_file_url = 'JSON file URL is required';
    } else {
      try {
        new URL(formData.json_file_url);
      } catch {
        if (!formData.json_file_url.startsWith('/') && !formData.json_file_url.includes('.')) {
          newErrors.json_file_url = 'Please enter a valid URL or file path';
        }
      }
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'tags') {
      setTagsInput(value);
      // Convert comma-separated string to array
      const tagsArray = value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, 10); // Limit to 10 tags
      
      setFormData(prev => ({ ...prev, tags: tagsArray }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const session = await saveDraft({ ...formData, id });
      
      if (!isEditing && session) {
        // Redirect to edit mode after creating new draft
        navigate(`/sessions/${session._id}/edit`, { replace: true });
      }
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await publishSession({ ...formData, id });
      navigate('/my-sessions');
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/my-sessions')}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Sessions
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Session' : 'Create New Session'}
                </h1>
                {isEditing && lastSaved && (
                  <p className="text-sm text-gray-600 mt-1">
                    Last saved {formatRelativeTime(lastSaved)}
                  </p>
                )}
              </div>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center space-x-2">
              {isSaving ? (
                <div className="flex items-center text-blue-600">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span className="text-sm">Saving...</span>
                </div>
              ) : lastSaved ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-2" />
                  <span className="text-sm">Saved</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border">
          <form className="p-8 space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Session Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter a descriptive title for your wellness session"
                maxLength={100}
              />
              <div className="flex justify-between mt-1">
                {errors.title ? (
                  <p className="text-sm text-red-600">{errors.title}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Give your session a clear, descriptive title
                  </p>
                )}
                <p className="text-sm text-gray-400">
                  {formData.title.length}/100
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe what this session is about, its benefits, and what participants can expect..."
                maxLength={500}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-sm text-red-600">{errors.description}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Optional: Provide details about your session
                  </p>
                )}
                <p className="text-sm text-gray-400">
                  {formData.description?.length || 0}/500
                </p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={tagsInput}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="meditation, yoga, mindfulness, relaxation"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate tags with commas (up to 10 tags)
              </p>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* JSON File URL */}
            <div>
              <label htmlFor="json_file_url" className="block text-sm font-medium text-gray-700 mb-2">
                JSON File URL *
              </label>
              <input
                type="url"
                id="json_file_url"
                name="json_file_url"
                value={formData.json_file_url}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.json_file_url ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com/session-data.json"
              />
              {errors.json_file_url ? (
                <p className="text-sm text-red-600 mt-1">{errors.json_file_url}</p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  URL to the JSON file containing your session data or configuration
                </p>
              )}
            </div>

            {/* Auto-save notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Auto-save Enabled</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your changes are automatically saved as a draft every 5 seconds when you're typing.
                    {lastSaved && ` Last saved ${formatRelativeTime(lastSaved)}.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading || isSaving}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                ) : (
                  <Save className="-ml-1 mr-2 h-4 w-4" />
                )}
                Save Draft
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={loading || isSaving}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                ) : (
                  <Send className="-ml-1 mr-2 h-4 w-4" />
                )}
                Publish Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionEditorPage;
