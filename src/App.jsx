import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import Chart from 'chart.js/auto';

// Keyframes for gradient animation
const gradientAnimation = keyframes`
  0% {
    background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  }
  50% {
    background: linear-gradient(120deg, #fda085 0%, #f6d365 100%);
  }
  100% {
    background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  }
`;

// Keyframes for noise animation
const noiseAnimation = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
`;

// AppContainer styled-component
const AppContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  text-align: center;
  padding: 20px;
  position: relative;
  background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  min-height: 100vh;
  box-sizing: border-box;
`;

// Noise overlay styled-component
const NoiseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8 ... ') repeat;
  opacity: 0.1;
  animation: ${noiseAnimation} 1s infinite linear;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const ChartContainer = styled.div`
  border: none;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }
  animation: ${fadeIn} 1s ease-in-out;
  width: 100%;
  max-width: 1200px;
`;



const Chart2Container = styled.div`
border: none;
border-radius: 15px;
padding: 20px;
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
background: rgba(255, 255, 255, 0.95);
transition: all 0.3s ease;
&:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}
animation: ${fadeIn} 1s ease-in-out;
width: 100%;
max-width: 500px;
height:200px;
margin-top: -285px;
`;

const PolarChartContainer = styled.div`

border: none;
border-radius: 15px;
padding: 20px;
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
background: rgba(255, 255, 255, 0.95);
transition: all 0.3s ease;
&:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}
animation: ${fadeIn} 1s ease-in-out;
width: 100%;
max-width: 500px;
height:200px;
margin-top: -285px;
margin-left: 1300px

`;




const AnimatedCanvas = styled.canvas`
  opacity: 0;
  transition: opacity 1s ease-in-out;
  &.fadeIn {
    opacity: 1;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
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
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const polarChartRef = useRef(null);
  const [barChartInstance, setBarChartInstance] = useState(null);
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [polarChartInstance, setPolarChartInstance] = useState(null);

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

  const applyFilters = (data) => {
    let filteredData = [...data];

    if (yearFilter && endYearFilter) {
      filteredData = filteredData.filter(item =>
        item.startyear >= yearFilter && item.endyear <= endYearFilter
      );
    } else if (yearFilter) {
      filteredData = filteredData.filter(item => item.startyear === yearFilter);
    } else if (endYearFilter) {
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

  const processPieData = () => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }
  





    const filteredData = applyFilters(data);
    const labels = Array.from(new Set(filteredData.map(item => item.country)));
    const values = labels.map(label => filteredData.filter(item => item.country === label).length);

    return {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#F56C42'],
      }],
    };
  };




  const processPolarData = () => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }
    const filteredData = applyFilters(data);
    const labels = Array.from(new Set(filteredData.map(item => item.region)));
    const values = labels.map(label => filteredData.filter(item => item.region === label).length);

    return {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#F56C42'],
      }],
    };
  };




  const chartData = processDataForChart();
  const pieData = processPieData();
  const polarData = processPolarData();

  useEffect(() => {
    const createOrUpdateChart = (chartRef, chartInstance, chartType, chartData) => {
      if (chartRef.current && data.length > 0) {
        if (chartInstance) {
          chartInstance.destroy();
        }

        const newChartInstance = new Chart(chartRef.current, {
          type: chartType,
          data: chartData,
          options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                },
              },
              y: {
                stacked: true,
                ticks: {
                  beginAtZero: true,
                },
              },
            },
          },
        });

        if (chartType === 'bar') {
          setBarChartInstance(newChartInstance);
        } else if (chartType === 'doughnut') {
          setPieChartInstance(newChartInstance);
        } else if (chartType === 'polarArea') {
          setPolarChartInstance(newChartInstance);
        }

        const canvas = chartRef.current;
        canvas.classList.add('fadeIn');
      }
    };

    createOrUpdateChart(barChartRef, barChartInstance, 'bar', chartData);
    createOrUpdateChart(pieChartRef, pieChartInstance, 'doughnut', pieData);
    createOrUpdateChart(polarChartRef, polarChartInstance, 'polarArea', polarData);

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
      <Title style={{color:"#766cf2"}}>Data Visualization Dashboard</Title>
      {data.length > 0 && (
        <FiltersContainer>
          <FilterLabel>
            Select Start Year:
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
        <ChartsContainer>
          <ChartContainer>
            <AnimatedCanvas height={500} ref={barChartRef}></AnimatedCanvas>
          </ChartContainer>
          <Chart2Container>
            <AnimatedCanvas height={500} ref={pieChartRef}></AnimatedCanvas>
          </Chart2Container>
          <PolarChartContainer>
            <AnimatedCanvas height={300} ref={polarChartRef}></AnimatedCanvas>
          </PolarChartContainer>
        </ChartsContainer>
      )}
    </AppContainer>
  );
}

export default App;