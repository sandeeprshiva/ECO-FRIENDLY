import { useState, useEffect, useCallback } from 'react';
import { analyticsAPI, handleApiError } from '../services/api';

export const useUserAnalytics = (userId) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsAPI.getUserAnalytics(userId);
      setAnalytics(response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorData = handleApiError(error);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics
  };
};

export const useCommunityAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsAPI.getCommunityAnalytics();
      setAnalytics(response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorData = handleApiError(error);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics
  };
};

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsAPI.getLeaderboard();
      setLeaderboard(response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorData = handleApiError(error);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    fetchLeaderboard
  };
};
