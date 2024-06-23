import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bar, Chart } from 'react-chartjs-2';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const AppContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f6f8f9, #e0eafc);
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  animation: ${fadeIn} 1s ease-in-out;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
`;

const FilterLabel = styled.label`
  margin: 10px;
  font-size: 1rem;
  color: #555;
  select {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-left: 10px;
    transition: all 0.3s ease;
    background: #fff;
    &:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
    }
    &:hover {
      border-color: #3e8e41;
    }
  }
`;

const ChartContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background: #fff;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  animation: ${fadeIn} 1s ease-in-out;
`;

const AnimatedCanvas = styled.canvas`
  opacity: 0;
  transition: opacity 1s ease-in-out;
  &.fadeIn {
    opacity: 1;
  }
`;

function App() {
  const [data, setData] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [endYearFilter, setEndYearFilter] = useState('');
  const [topicsFilter, setTopicsFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [PESTFilter, setPESTFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [SWOTFilter, setSWOTFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9000/getdata');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const processDataForChart = () => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const filteredData = applyFilters(data);

    const labels = filteredData.map(item => item.country);
    const intensityData = filteredData.map(item => item.intensity);
    const likelihoodData = filteredData.map(item => item.likelihood);
    const relevanceData = filteredData.map(item => item.relevance);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Intensity',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          data: intensityData,
        },
        {
          label: 'Likelihood',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          data: likelihoodData,
        },
        {
          label: 'Relevance',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: relevanceData,
        }
      ],
    };
  };

  const applyFilters = (data) => {
    let filteredData = [...data];
    if (yearFilter) {
      filteredData = filteredData.filter(item => item.startyear === yearFilter);
    }
    if (endYearFilter) {
      filteredData = filteredData.filter(item => item.endyear === endYearFilter);
    }
    if (topicsFilter) {
      filteredData = filteredData.filter(item => item.topics.includes(topicsFilter));
    }
    if (sectorFilter) {
      filteredData = filteredData.filter(item => item.sector === sectorFilter);
    }
    if (regionFilter) {
      filteredData = filteredData.filter(item => item.region === regionFilter);
    }
    if (PESTFilter) {
      filteredData = filteredData.filter(item => item.pestle === PESTFilter);
    }
    if (sourceFilter) {
      filteredData = filteredData.filter(item => item.source === sourceFilter);
    }
    if (SWOTFilter) {
      filteredData = filteredData.filter(item => item.swot === SWOTFilter);
    }
    if (countryFilter) {
      filteredData = filteredData.filter(item => item.country === countryFilter);
    }
    if (cityFilter) {
      filteredData = filteredData.filter(item => item.city === cityFilter);
    }
    return filteredData;
  };

  const chartData = processDataForChart();

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const newChartInstance = new Chart(chartRef.current, {
        type: 'bar',
        data: chartData,
        options: {
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
              },
            }],
          },
        },
      });

      setChartInstance(newChartInstance);

      const canvas = chartRef.current;
      canvas.classList.add('fadeIn');
    }
  }, [data, yearFilter, endYearFilter, topicsFilter, sectorFilter, regionFilter, PESTFilter, sourceFilter, SWOTFilter, countryFilter, cityFilter]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'yearFilter':
        setYearFilter(value);
        break;
      case 'endYearFilter':
        setEndYearFilter(value);
        break;
      case 'topicsFilter':
        setTopicsFilter(value);
        break;
      case 'sectorFilter':
        setSectorFilter(value);
        break;
      case 'regionFilter':
        setRegionFilter(value);
        break;
      case 'PESTFilter':
        setPESTFilter(value);
        break;
      case 'sourceFilter':
        setSourceFilter(value);
        break;
      case 'SWOTFilter':
        setSWOTFilter(value);
        break;
      case 'countryFilter':
        setCountryFilter(value);
        break;
      case 'cityFilter':
        setCityFilter(value);
        break;
      default:
        break;
    }
  };

  return (
    <AppContainer>
      <Title>Data Visualization Dashboard</Title>
      {data.length > 0 && (
        <FiltersContainer>
          <FilterLabel>
            Select Year:
            <select name="yearFilter" value={yearFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(new Set(data.map(item => item.startyear))).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </FilterLabel>
          <FilterLabel>
            Select End Year:
            <select name="endYearFilter" value={endYearFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(new Set(data.map(item => item.endyear))).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </FilterLabel>
          <FilterLabel>
            Select Topics:
            <select name="topicsFilter" value={topicsFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(new Set(data.flatMap(item => item.topics))).map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </FilterLabel>
          <FilterLabel>
            Select Sector:
            <select name="sectorFilter" value={sectorFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(new Set(data.map(item => item.sector))).map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </FilterLabel>
          <FilterLabel>
            Select Region:
            <select name="regionFilter" value={regionFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(new Set(data.map(item => item.region))).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </FilterLabel>
          <FilterLabel>
            Select PEST:
            <select name="PESTFilter" value={PESTFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(new Set(data.map(item => item.pestle))).map(pest => (
                <option key={pest} value={pest}>{pest}</option>
              ))}
            </select>
          </FilterLabel>
          <FilterLabel>
            Select Source:
            <select name="sourceFilter" value={sourceFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(new Set(data.map(item => item.source))).map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </FilterLabel>
          <FilterLabel>
            Select SWOT:
            <select name="SWOTFilter" value={SWOTFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(new Set(data.map(item => item.swot))).map(swot => (
                <option key={swot} value={swot}>{swot}</option>
              ))}
            </select>
          </FilterLabel>
          <FilterLabel>
            Select Country:
            <select name="countryFilter" value={countryFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(new Set(data.map(item => item.country))).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </FilterLabel>
          <FilterLabel>
            Select City:
            <select name="cityFilter" value={cityFilter} onChange={handleFilterChange}>
              <option value="">All</option>
              {Array.from(new Set(data.map(item => item.city))).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </FilterLabel>
        </FiltersContainer>
      )}
      {data.length > 0 && (
        <ChartContainer>
          <AnimatedCanvas height={500} ref={chartRef}></AnimatedCanvas>
        </ChartContainer>
      )}
    </AppContainer>
  );
}

export default App;
