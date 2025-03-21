
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TopicCard from '../components/TopicCard';
import { topicsData } from '../data/topicsData';
import '../styles/responsive.css';

const TopicsContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 576px) {
    padding: 10px;
  }
`;

const TopicsHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
  
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
  
  @media (max-width: 576px) {
    margin-bottom: 20px;
  }
`;

const TopicsTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 576px) {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
`;

const TopicsDescription = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 20px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    gap: 8px;
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? '#4361ee' : '#e9ecef'};
  color: ${props => props.active ? 'white' : '#495057'};
  padding: 8px 15px;
  border-radius: 20px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#3a56d4' : '#dee2e6'};
  }
  
  @media (max-width: 768px) {
    padding: 10px 15px; /* Larger touch target */
  }
  
  @media (max-width: 576px) {
    font-size: 0.85rem;
    padding: 8px 12px;
    flex: 1 0 auto;
    text-align: center;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const FiltersWrapper = styled.div`
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
`;

const FilterLabel = styled.div`
  font-weight: 500;
  margin-right: 10px;
  color: #495057;
  
  @media (max-width: 576px) {
    margin-bottom: 5px;
    margin-right: 0;
    width: 100%;
    text-align: center;
  }
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  font-size: 1rem;
  width: 250px;
  
  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    min-height: 44px; /* Better touch target */
    font-size: 16px; /* Prevents iOS zoom */
  }
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const NoTopicsFound = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f8f9fa;
  border-radius: 10px;
  color: #6c757d;
  font-size: 1.1rem;
  
  @media (max-width: 768px) {
    padding: 30px;
    font-size: 1rem;
  }
  
  @media (max-width: 576px) {
    padding: 20px;
    font-size: 0.9rem;
  }
`;

const CategoryFiltersContainer = styled.div`
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  
  /* Hide scrollbar but allow scrolling */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const ScrollableFilterGroup = styled(FilterGroup)`
  flex-wrap: nowrap;
  padding-bottom: 5px;
  
  @media (max-width: 576px) {
    justify-content: flex-start;
  }
`;

const Topics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Handle window resize to detect screen size changes
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredTopics = topicsData.filter(topic => {
    // Search filter
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Difficulty filter
    const matchesDifficulty = difficultyFilter === 'all' || topic.difficulty === difficultyFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || topic.category === categoryFilter;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });
  
  // Get unique categories from topics data
  const categories = ['all', ...new Set(topicsData.map(topic => topic.category))];
  
  // Function to render difficulty filters
  const renderDifficultyFilters = () => (
    <FilterGroup>
      {windowWidth <= 576 && <FilterLabel>Difficulty:</FilterLabel>}
      <FilterButton 
        active={difficultyFilter === 'all'} 
        onClick={() => setDifficultyFilter('all')}
        className="touch-friendly-spacing"
      >
        All Difficulties
      </FilterButton>
      <FilterButton 
        active={difficultyFilter === 'easy'} 
        onClick={() => setDifficultyFilter('easy')}
        className="touch-friendly-spacing"
      >
        Easy
      </FilterButton>
      <FilterButton 
        active={difficultyFilter === 'medium'} 
        onClick={() => setDifficultyFilter('medium')}
        className="touch-friendly-spacing"
      >
        Medium
      </FilterButton>
      <FilterButton 
        active={difficultyFilter === 'hard'} 
        onClick={() => setDifficultyFilter('hard')}
        className="touch-friendly-spacing"
      >
        Hard
      </FilterButton>
    </FilterGroup>
  );
  
  return (
    <TopicsContainer>
      <TopicsHeader>
        <TopicsTitle>Explore Topics</TopicsTitle>
        <TopicsDescription>
          Choose from a variety of topics to test your knowledge and improve your skills.
          Our adaptive quiz system will personalize the experience based on your performance.
        </TopicsDescription>
      </TopicsHeader>
      
      <FiltersWrapper>
        {/* Search input - moved to top for mobile */}
        <SearchInput 
          type="text" 
          placeholder="Search topics..." 
          value={searchTerm}
          onChange={handleSearchChange}
          className="mobile-full-width"
        />
        
        {/* Difficulty filters */}
        <FiltersContainer>
          {renderDifficultyFilters()}
        </FiltersContainer>
        
        {/* Category filters - horizontally scrollable on mobile */}
        <CategoryFiltersContainer>
          {windowWidth <= 576 && <FilterLabel>Category:</FilterLabel>}
          <ScrollableFilterGroup>
            {categories.map(category => (
              <FilterButton 
                key={category}
                active={categoryFilter === category} 
                onClick={() => setCategoryFilter(category)}
                className="touch-friendly-spacing"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </FilterButton>
            ))}
          </ScrollableFilterGroup>
        </CategoryFiltersContainer>
      </FiltersWrapper>
      
      {filteredTopics.length > 0 ? (
        <TopicsGrid>
          {filteredTopics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </TopicsGrid>
      ) : (
        <NoTopicsFound className="mobile-full-width">
          No topics found matching your filters. Try adjusting your search criteria.
        </NoTopicsFound>
      )}
    </TopicsContainer>
  );
};

export default Topics;
