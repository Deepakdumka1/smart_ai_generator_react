import React, { useState } from 'react';
import styled from 'styled-components';
import TopicCard from '../components/TopicCard';
import { topicsData } from '../data/topicsData';

const TopicsContainer = styled.div``;

const TopicsHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const TopicsTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
`;

const TopicsDescription = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
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
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
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
  
  &:hover {
    background-color: ${props => props.active ? '#3a56d4' : '#dee2e6'};
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
  }
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const NoTopicsFound = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f8f9fa;
  border-radius: 10px;
  color: #6c757d;
  font-size: 1.1rem;
`;

const Topics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
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
  
  return (
    <TopicsContainer>
      <TopicsHeader>
        <TopicsTitle>Explore Topics</TopicsTitle>
        <TopicsDescription>
          Choose from a variety of topics to test your knowledge and improve your skills.
          Our adaptive quiz system will personalize the experience based on your performance.
        </TopicsDescription>
      </TopicsHeader>
      
      <FiltersContainer>
        <FilterGroup>
          <FilterButton 
            active={difficultyFilter === 'all'} 
            onClick={() => setDifficultyFilter('all')}
          >
            All Difficulties
          </FilterButton>
          <FilterButton 
            active={difficultyFilter === 'easy'} 
            onClick={() => setDifficultyFilter('easy')}
          >
            Easy
          </FilterButton>
          <FilterButton 
            active={difficultyFilter === 'medium'} 
            onClick={() => setDifficultyFilter('medium')}
          >
            Medium
          </FilterButton>
          <FilterButton 
            active={difficultyFilter === 'hard'} 
            onClick={() => setDifficultyFilter('hard')}
          >
            Hard
          </FilterButton>
        </FilterGroup>
        
        <SearchInput 
          type="text" 
          placeholder="Search topics..." 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </FiltersContainer>
      
      <FilterGroup style={{ marginBottom: '20px' }}>
        {categories.map(category => (
          <FilterButton 
            key={category}
            active={categoryFilter === category} 
            onClick={() => setCategoryFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </FilterButton>
        ))}
      </FilterGroup>
      
      {filteredTopics.length > 0 ? (
        <TopicsGrid>
          {filteredTopics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </TopicsGrid>
      ) : (
        <NoTopicsFound>
          No topics found matching your filters. Try adjusting your search criteria.
        </NoTopicsFound>
      )}
    </TopicsContainer>
  );
};

export default Topics;
