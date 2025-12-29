import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  fetchFunds,
  fetchFundDetails,
  setFilters,
} from '../redux/slices/fundSlice';

export const useFunds = () => {
  const dispatch = useDispatch();
  const {
    funds,
    fundDetails,
    watchlist,
    categories,
    loading,
    error,
    filters,
    pagination,
  } = useSelector((state) => state.funds);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchFunds({ ...filters, search: searchQuery }));
  }, [filters, searchQuery, dispatch]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getFundById = (fundId) => {
    return funds.find(fund => fund.id === fundId) || fundDetails;
  };

  const loadFundDetails = (fundId) => {
    dispatch(fetchFundDetails(fundId));
  };

  return {
    funds,
    fundDetails,
    watchlist,
    categories,
    loading,
    error,
    filters,
    pagination,
    searchQuery,
    handleFilterChange,
    handleSearch,
    getFundById,
    loadFundDetails,
  };
};