import { useState, useEffect, useCallback } from 'react';
import { itemsAPI, handleApiError } from '../services/api';

export const useItems = (initialFilters = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchItems = useCallback(async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...newFilters
      };
      
      const response = await itemsAPI.getItems(params);
      const { items: fetchedItems, pagination: paginationData } = response.data;
      
      setItems(fetchedItems);
      setPagination(paginationData);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorData = handleApiError(error);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const searchItems = useCallback(async (query, searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        q: query,
        ...filters,
        ...searchFilters
      };
      
      const response = await itemsAPI.searchItems(query, params);
      const { items: searchedItems, pagination: paginationData } = response.data;
      
      setItems(searchedItems);
      setPagination(paginationData);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorData = handleApiError(error);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const loadMore = useCallback(async () => {
    if (pagination.page < pagination.totalPages) {
      const nextPage = pagination.page + 1;
      setPagination(prev => ({ ...prev, page: nextPage }));
      
      try {
        setLoading(true);
        const params = {
          page: nextPage,
          limit: pagination.limit,
          ...filters
        };
        
        const response = await itemsAPI.getItems(params);
        const { items: newItems } = response.data;
        
        setItems(prev => [...prev, ...newItems]);
        setPagination(prev => ({ ...prev, page: nextPage }));
      } catch (error) {
        const errorData = handleApiError(error);
        setError(errorData.message);
      } finally {
        setLoading(false);
      }
    }
  }, [pagination, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [initialFilters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    pagination,
    filters,
    fetchItems,
    searchItems,
    loadMore,
    updateFilters,
    resetFilters,
    hasMore: pagination.page < pagination.totalPages
  };
};

export const useItem = (id) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItem = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await itemsAPI.getItem(id);
      setItem(response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorData = handleApiError(error);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return {
    item,
    loading,
    error,
    fetchItem
  };
};
