import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Session, SessionFormData } from '@/types';
import { apiClient } from '@/utils/api';
import { debounce } from '@/utils/helpers';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicSessions = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getPublicSessions(page, limit);
      
      if (response.success && response.data) {
        setSessions(response.data.sessions);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch sessions';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMySessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMySessions();
      
      if (response.success && response.data) {
        setSessions(response.data.sessions);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch your sessions';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (sessionData: SessionFormData) => {
    try {
      const response = await apiClient.saveDraft(sessionData);
      
      if (response.success && response.data) {
        setSessions(prev => [response.data!.session, ...prev]);
        toast.success('Session created successfully');
        return response.data.session;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create session';
      toast.error(message);
      throw err;
    }
  }, []);

  const saveDraft = useCallback(async (sessionData: SessionFormData) => {
    try {
      const response = await apiClient.saveDraft(sessionData);
      
      if (response.success && response.data) {
        setSessions(prev => 
          sessionData.id 
            ? prev.map(session => 
                session._id === sessionData.id ? response.data!.session : session
              )
            : [response.data!.session, ...prev]
        );
        return response.data.session;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save session';
      toast.error(message);
      throw err;
    }
  }, []);

  const updateSession = useCallback(async (id: string, sessionData: SessionFormData) => {
    try {
      const response = await apiClient.updateSession(id, sessionData);
      
      if (response.success && response.data) {
        setSessions(prev => 
          prev.map(session => 
            session._id === id ? response.data!.session : session
          )
        );
        toast.success('Session updated successfully');
        return response.data.session;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update session';
      toast.error(message);
      throw err;
    }
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    try {
      const response = await apiClient.deleteSession(id);
      
      if (response.success) {
        setSessions(prev => prev.filter(session => session._id !== id));
        toast.success('Session deleted successfully');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete session';
      toast.error(message);
      throw err;
    }
  }, []);

  const publishSession = useCallback(async (sessionData: SessionFormData) => {
    try {
      const response = await apiClient.publishSession(sessionData);
      
      if (response.success && response.data) {
        setSessions(prev => 
          sessionData.id 
            ? prev.map(session => 
                session._id === sessionData.id ? response.data!.session : session
              )
            : [response.data!.session, ...prev]
        );
        toast.success('Session published successfully');
        return response.data.session;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to publish session';
      toast.error(message);
      throw err;
    }
  }, []);

  return {
    sessions,
    loading,
    error,
    fetchPublicSessions,
    fetchMySessions,
    createSession,
    saveDraft,
    updateSession,
    deleteSession,
    publishSession,
  };
};

export const useAutoSave = (
  sessionData: SessionFormData,
  saveCallback: (data: SessionFormData) => Promise<any>,
  delay = 5000
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const debouncedSave = useCallback(
    debounce(async (data: SessionFormData) => {
      if (!data.title.trim() || !data.json_file_url.trim()) return;
      
      try {
        setIsSaving(true);
        await saveCallback(data);
        setLastSaved(new Date());
        toast.success('Auto-saved', { duration: 2000, icon: '💾' });
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, delay),
    [saveCallback, delay]
  );

  useEffect(() => {
    if (sessionData.title || sessionData.json_file_url) {
      debouncedSave(sessionData);
    }
  }, [sessionData, debouncedSave]);

  return {
    isSaving,
    lastSaved,
  };
};
