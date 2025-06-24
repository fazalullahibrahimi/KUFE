import React from "react";
import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  MapPin,
  Calendar,
  Activity,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Award,
  Target,
  Eye,
  CheckCircle,
  Settings,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { useLanguage } from "../contexts/LanguageContext";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DashboardHome = () => {
  const { t, isRTL, language } = useLanguage();

  // Debug: Log language changes
  useEffect(() => {
    console.log("DashboardHome - Language changed:", language, "isRTL:", isRTL);
  }, [language, isRTL]);

  // State for API data
  const [departmentData, setDepartmentData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  // Overview stats
  const [overviewStats, setOverviewStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalFaculty: 0,
    totalDepartments: 0,
    totalFaculties: 0,
    totalResearch: 0,
    totalEvents: 0,
    totalNews: 0,
    activePrograms: 0,
    graduationRate: 0
  });

  // Additional dashboard data
  const [courseStats, setCourseStats] = useState({});
  const [teacherStats, setTeacherStats] = useState({});
  const [researchStats, setResearchStats] = useState({});
  const [activityStats, setActivityStats] = useState({});
  const [recentActivities, setRecentActivities] = useState({});

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          overviewResponse,
          courseStatsResponse,
          teacherStatsResponse,
          researchStatsResponse,
          activityStatsResponse,
          recentActivitiesResponse,
          deptResponse,
          yearResponse,
          cityResponse
        ] = await Promise.all([
          axios.get('http://localhost:4400/api/v1/dashboard/overview'),
          axios.get('http://localhost:4400/api/v1/dashboard/course-stats'),
          axios.get('http://localhost:4400/api/v1/dashboard/teacher-stats'),
          axios.get('http://localhost:4400/api/v1/dashboard/research-stats'),
          axios.get('http://localhost:4400/api/v1/dashboard/activity-stats'),
          axios.get('http://localhost:4400/api/v1/dashboard/recent-activities'),
          axios.get('http://localhost:4400/api/v1/students/count-by-department'),
          axios.get('http://localhost:4400/api/v1/students/count-by-year'),
          axios.get('http://localhost:4400/api/v1/students/count-by-city')
        ]);

        // Extract data from API responses
        const overviewData = overviewResponse.data?.data?.overview || {};
        const courseStatsData = courseStatsResponse.data?.data?.data || {};
        const teacherStatsData = teacherStatsResponse.data?.data?.data || {};
        const researchStatsData = researchStatsResponse.data?.data?.data || {};
        const activityStatsData = activityStatsResponse.data?.data?.data || {};
        const recentActivitiesData = recentActivitiesResponse.data?.data?.data || {};
        const deptData = deptResponse.data?.data?.data || [];
        const yearDataRes = yearResponse.data?.data?.data || [];
        const cityDataRes = cityResponse.data?.data?.data || [];

        // Set all data states
        setDepartmentData(deptData);
        setYearData(yearDataRes);
        setCityData(cityDataRes);
        setCourseStats(courseStatsData);
        setTeacherStats(teacherStatsData);
        setResearchStats(researchStatsData);
        setActivityStats(activityStatsData);
        setRecentActivities(recentActivitiesData);

        // Set overview statistics from API
        setOverviewStats({
          totalStudents: overviewData.totalStudents || 0,
          totalCourses: overviewData.totalCourses || 0,
          totalFaculty: overviewData.totalTeachers || 0,
          totalDepartments: overviewData.totalDepartments || 0,
          totalFaculties: overviewData.totalFaculties || 0,
          totalResearch: overviewData.totalResearch || 0,
          totalEvents: overviewData.totalEvents || 0,
          totalNews: overviewData.totalNews || 0,
          activePrograms: overviewData.activePrograms || 0,
          graduationRate: overviewData.graduationRate || 0
        });

        // Calculate total students for backward compatibility
        const total = deptData.reduce((sum, dept) => sum + dept.count, 0);
        setTotalStudents(total);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Enhanced refresh data function
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        overviewResponse,
        courseStatsResponse,
        teacherStatsResponse,
        researchStatsResponse,
        activityStatsResponse,
        recentActivitiesResponse,
        deptResponse,
        yearResponse,
        cityResponse
      ] = await Promise.all([
        axios.get('http://localhost:4400/api/v1/dashboard/overview'),
        axios.get('http://localhost:4400/api/v1/dashboard/course-stats'),
        axios.get('http://localhost:4400/api/v1/dashboard/teacher-stats'),
        axios.get('http://localhost:4400/api/v1/dashboard/research-stats'),
        axios.get('http://localhost:4400/api/v1/dashboard/activity-stats'),
        axios.get('http://localhost:4400/api/v1/dashboard/recent-activities'),
        axios.get('http://localhost:4400/api/v1/students/count-by-department'),
        axios.get('http://localhost:4400/api/v1/students/count-by-year'),
        axios.get('http://localhost:4400/api/v1/students/count-by-city')
      ]);

      // Extract data from API responses
      const overviewData = overviewResponse.data?.data?.overview || {};
      const courseStatsData = courseStatsResponse.data?.data?.data || {};
      const teacherStatsData = teacherStatsResponse.data?.data?.data || {};
      const researchStatsData = researchStatsResponse.data?.data?.data || {};
      const activityStatsData = activityStatsResponse.data?.data?.data || {};
      const recentActivitiesData = recentActivitiesResponse.data?.data?.data || {};
      const deptData = deptResponse.data?.data?.data || [];
      const yearDataRes = yearResponse.data?.data?.data || [];
      const cityDataRes = cityResponse.data?.data?.data || [];

      // Set all data states
      setDepartmentData(deptData);
      setYearData(yearDataRes);
      setCityData(cityDataRes);
      setCourseStats(courseStatsData);
      setTeacherStats(teacherStatsData);
      setResearchStats(researchStatsData);
      setActivityStats(activityStatsData);
      setRecentActivities(recentActivitiesData);

      // Set overview statistics from API
      setOverviewStats({
        totalStudents: overviewData.totalStudents || 0,
        totalCourses: overviewData.totalCourses || 0,
        totalFaculty: overviewData.totalTeachers || 0,
        totalDepartments: overviewData.totalDepartments || 0,
        totalFaculties: overviewData.totalFaculties || 0,
        totalResearch: overviewData.totalResearch || 0,
        totalEvents: overviewData.totalEvents || 0,
        totalNews: overviewData.totalNews || 0,
        activePrograms: overviewData.activePrograms || 0,
        graduationRate: overviewData.graduationRate || 0
      });

      // Calculate total students for backward compatibility
      const total = deptData.reduce((sum, dept) => sum + dept.count, 0);
      setTotalStudents(total);

      // Show success notification
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 3000);

    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Advanced Chart Configurations
  const getAdvancedBarOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: true,
      axis: 'x'
    },
    hover: {
      mode: 'nearest',
      intersect: true,
      animationDuration: 200
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        external: null,
        mode: 'nearest',
        intersect: true,
        position: 'nearest',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        titleColor: '#F4B400',
        bodyColor: '#ffffff',
        borderColor: '#F4B400',
        borderWidth: 3,
        cornerRadius: 12,
        displayColors: false,
        titleFont: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 14,
          family: "'Inter', sans-serif"
        },
        footerFont: {
          size: 12,
          family: "'Inter', sans-serif",
          style: 'italic'
        },
        padding: 20,
        caretSize: 10,
        caretPadding: 8,
        xAlign: 'center',
        yAlign: 'bottom',
        callbacks: {
          title: function(context) {
            return `${context[0].label}`;
          },
          label: function(context) {
            return `${context.parsed.y.toLocaleString()} Students`;
          },
          afterLabel: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
            return `${percentage}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 75, 135, 0.1)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
            weight: '500',
            family: "'Inter', sans-serif"
          },
          padding: 10,
          callback: function(value) {
            return value + ' 👥';
          }
        },
        title: {
          display: true,
          text: 'Number of Students',
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', sans-serif"
          },
          padding: 20
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
            weight: '500',
            family: "'Inter', sans-serif"
          },
          maxRotation: 0,
          padding: 10
        },
        title: {
          display: true,
          text: 'Academic Departments',
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', sans-serif"
          },
          padding: 20
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      delay: (context) => context.dataIndex * 200
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const department = departmentData[elementIndex];
        if (department) {
          alert(`📚 ${department.departmentName}\n👥 ${department.count} Students\n📊 ${((department.count / totalStudents) * 100).toFixed(1)}% of total enrollment\n\n💡 This department is ${department.count > totalStudents/departmentData.length ? 'above' : 'below'} average enrollment.`);
        }
      }
    }
  });

  const getAdvancedPieOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: true
    },
    hover: {
      mode: 'nearest',
      intersect: true,
      animationDuration: 200
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: '500',
            family: "'Inter', sans-serif"
          },
          color: '#374151',
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor,
                  lineWidth: dataset.borderWidth,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        enabled: true,
        external: null,
        mode: 'nearest',
        intersect: true,
        position: 'nearest',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        titleColor: '#F4B400',
        bodyColor: '#ffffff',
        borderColor: '#F4B400',
        borderWidth: 3,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 14,
          family: "'Inter', sans-serif"
        },
        footerFont: {
          size: 12,
          family: "'Inter', sans-serif",
          style: 'italic'
        },
        padding: 20,
        caretSize: 10,
        caretPadding: 8,
        callbacks: {
          title: function(context) {
            return `${context[0].label}`;
          },
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.parsed.toLocaleString()} Students (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const city = cityData[elementIndex];
        if (city) {
          const percentage = ((city.count / totalStudents) * 100).toFixed(1);
          const rank = cityData
            .map((c, i) => ({ ...c, originalIndex: i }))
            .sort((a, b) => b.count - a.count)
            .findIndex(c => c.originalIndex === elementIndex) + 1;

          alert(`🏙️ ${city.city} City\n👥 ${city.count} Students\n📊 ${percentage}% of total enrollment\n🏆 Rank #${rank} among all cities\n\n💡 This is ${rank <= 3 ? 'a top recruiting city' : 'an important student source'} for the university.`);
        }
      }
    }
  });

  const getAdvancedLineOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x'
    },
    hover: {
      mode: 'nearest',
      intersect: false,
      animationDuration: 200
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        external: null,
        mode: 'nearest',
        intersect: false,
        position: 'nearest',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        titleColor: '#F4B400',
        bodyColor: '#ffffff',
        borderColor: '#F4B400',
        borderWidth: 3,
        cornerRadius: 12,
        displayColors: false,
        titleFont: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 14,
          family: "'Inter', sans-serif"
        },
        footerFont: {
          size: 12,
          family: "'Inter', sans-serif",
          style: 'italic'
        },
        padding: 20,
        caretSize: 10,
        caretPadding: 8,
        callbacks: {
          title: function(context) {
            return `Year ${context[0].label}`;
          },
          label: function(context) {
            return `${context.parsed.y.toLocaleString()} Students`;
          },
          afterLabel: function(context) {
            const currentYear = context.parsed.y;
            const allYears = context.chart.data.datasets[0].data;
            const yearIndex = context.dataIndex;

            if (yearIndex > 0) {
              const previousYear = allYears[yearIndex - 1];
              const change = currentYear - previousYear;
              const changePercent = ((change / previousYear) * 100).toFixed(1);

              if (change > 0) {
                return `+${changePercent}%`;
              } else if (change < 0) {
                return `${changePercent}%`;
              }
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(22, 160, 133, 0.1)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
            weight: '500',
            family: "'Inter', sans-serif"
          },
          padding: 10,
          callback: function(value) {
            return value + ' 🎓';
          }
        },
        title: {
          display: true,
          text: 'Number of Students',
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', sans-serif"
          },
          padding: 20
        }
      },
      x: {
        grid: {
          color: 'rgba(22, 160, 133, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 12,
            weight: '500',
            family: "'Inter', sans-serif"
          },
          padding: 10
        },
        title: {
          display: true,
          text: 'Enrollment Year',
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Inter', sans-serif"
          },
          padding: 20
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const year = yearData[elementIndex];
        if (year) {
          const allYears = yearData.map(y => y.count);
          const average = (allYears.reduce((a, b) => a + b, 0) / allYears.length).toFixed(0);
          const isHighest = year.count === Math.max(...allYears);
          const isLowest = year.count === Math.min(...allYears);

          let trend = '';
          if (elementIndex > 0) {
            const previousYear = yearData[elementIndex - 1].count;
            const change = year.count - previousYear;
            const changePercent = ((change / previousYear) * 100).toFixed(1);

            if (change > 0) {
              trend = `📈 Increased by ${change} students (+${changePercent}%) from previous year`;
            } else if (change < 0) {
              trend = `📉 Decreased by ${Math.abs(change)} students (${changePercent}%) from previous year`;
            } else {
              trend = `➡️ Same enrollment as previous year`;
            }
          }

          alert(`📅 Academic Year ${year.year}\n🎓 ${year.count} New Students Enrolled\n📊 ${year.count > average ? 'Above' : year.count < average ? 'Below' : 'Equal to'} average (${average})\n${isHighest ? '🏆 Peak enrollment year' : isLowest ? '📉 Lowest enrollment year' : '📈 Historical data point'}\n\n${trend}\n\n💡 This year represents ${((year.count / totalStudents) * 100).toFixed(1)}% of current total enrollment.`);
        }
      }
    }
  });

  // Advanced Department Chart Data with Gradients
  const createGradient = (ctx, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  };

  const departmentChartData = {
    labels: departmentData.map(dept => dept.departmentName || 'Unknown'),
    datasets: [
      {
        label: 'Students by Department',
        data: departmentData.map(dept => dept.count),
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx} = chart;
          const colors = [
            ['rgba(0, 75, 135, 0.9)', 'rgba(0, 75, 135, 0.3)'],
            ['rgba(244, 180, 0, 0.9)', 'rgba(244, 180, 0, 0.3)'],
            ['rgba(59, 130, 246, 0.9)', 'rgba(59, 130, 246, 0.3)'],
            ['rgba(16, 185, 129, 0.9)', 'rgba(16, 185, 129, 0.3)'],
            ['rgba(139, 92, 246, 0.9)', 'rgba(139, 92, 246, 0.3)'],
            ['rgba(236, 72, 153, 0.9)', 'rgba(236, 72, 153, 0.3)'],
            ['rgba(245, 101, 101, 0.9)', 'rgba(245, 101, 101, 0.3)'],
            ['rgba(168, 85, 247, 0.9)', 'rgba(168, 85, 247, 0.3)']
          ];
          const colorIndex = context.dataIndex % colors.length;
          return createGradient(ctx, colors[colorIndex][0], colors[colorIndex][1]);
        },
        borderColor: [
          '#004B87',
          '#F4B400',
          '#3B82F6',
          '#10B981',
          '#8B5CF6',
          '#EC4899',
          '#F56565',
          '#A855F7'
        ],
        borderWidth: 3,
        borderRadius: {
          topLeft: 12,
          topRight: 12,
          bottomLeft: 4,
          bottomRight: 4
        },
        borderSkipped: false,
        hoverBackgroundColor: [
          'rgba(0, 75, 135, 1)',
          'rgba(244, 180, 0, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(245, 101, 101, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        hoverBorderWidth: 5,
        hoverBorderColor: '#F4B400',
        hoverBorderRadius: 15,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      }
    ]
  };

  // Advanced Year Chart Data with Gradient Fill
  const yearChartData = {
    labels: yearData.map(year => year.year?.toString() || 'Unknown'),
    datasets: [
      {
        label: 'Students by Enrollment Year',
        data: yearData.map(year => year.count),
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(22, 160, 133, 0.8)');
          gradient.addColorStop(0.5, 'rgba(22, 160, 133, 0.4)');
          gradient.addColorStop(1, 'rgba(22, 160, 133, 0.1)');
          return gradient;
        },
        borderColor: '#16A085',
        borderWidth: 4,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: function(context) {
          const colors = ['#004B87', '#F4B400', '#16A085', '#8B5CF6', '#EC4899'];
          return colors[context.dataIndex % colors.length];
        },
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: '#F4B400',
        pointHoverBorderColor: '#004B87',
        pointHoverBorderWidth: 4,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowBlur: 8,
        shadowColor: 'rgba(22, 160, 133, 0.3)'
      }
    ]
  };

  // Advanced City Chart Data (Pie Chart) with Gradients and Effects
  const cityChartData = {
    labels: cityData.slice(0, 8).map(city => city.city || 'Unknown'),
    datasets: [
      {
        label: 'Students by City',
        data: cityData.slice(0, 8).map(city => city.count),
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx} = chart;
          const colors = [
            ['#004B87', '#1E5A8A'],
            ['#F4B400', '#F59E0B'],
            ['#3B82F6', '#2563EB'],
            ['#10B981', '#059669'],
            ['#8B5CF6', '#7C3AED'],
            ['#EC4899', '#DB2777'],
            ['#F56565', '#EF4444'],
            ['#A855F7', '#9333EA']
          ];

          const colorIndex = context.dataIndex % colors.length;
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 200);
          gradient.addColorStop(0, colors[colorIndex][0]);
          gradient.addColorStop(1, colors[colorIndex][1]);
          return gradient;
        },
        borderColor: '#ffffff',
        borderWidth: 4,
        hoverOffset: 15,
        hoverBorderWidth: 6,
        hoverBorderColor: '#F4B400',
        hoverBackgroundColor: [
          '#1E40AF',
          '#D97706',
          '#1D4ED8',
          '#047857',
          '#6D28D9',
          '#BE185D',
          '#DC2626',
          '#7C2D12'
        ],
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowBlur: 15,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        cutout: '20%',
        radius: '90%',
        spacing: 2
      }
    ]
  };

  // Overview Statistics Chart Data (Doughnut Chart)
  const overviewChartData = {
    labels: [
      'Students', 'Courses', 'Teachers', 'Departments',
      'Faculties', 'Research', 'Events', 'News', 'Programs'
    ],
    datasets: [
      {
        label: 'Economic Faculty Overview',
        data: [
          overviewStats.totalStudents,
          overviewStats.totalCourses,
          overviewStats.totalFaculty,
          overviewStats.totalDepartments,
          overviewStats.totalFaculties,
          overviewStats.totalResearch,
          overviewStats.totalEvents,
          overviewStats.totalNews,
          overviewStats.activePrograms
        ],
        backgroundColor: [
          '#F4B400', '#16A085', '#8B5CF6', '#EC4899',
          '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 15,
        hoverBorderWidth: 4,
        cutout: '40%'
      }
    ]
  };

  // Course Statistics Chart Data (Bar Chart)
  const courseStatsChartData = {
    labels: courseStats.coursesByDepartment?.map(item => item.departmentName) || [],
    datasets: [
      {
        label: 'Courses by Department',
        data: courseStats.coursesByDepartment?.map(item => item.count) || [],
        backgroundColor: [
          '#F4B400', '#16A085', '#8B5CF6', '#EC4899',
          '#06B6D4', '#10B981', '#F59E0B', '#EF4444'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  // Teacher Statistics Chart Data (Pie Chart)
  const teacherStatsChartData = {
    labels: teacherStats.teachersByDepartment?.map(item => item.departmentName) || [],
    datasets: [
      {
        label: 'Teachers by Department',
        data: teacherStats.teachersByDepartment?.map(item => item.count) || [],
        backgroundColor: [
          '#8B5CF6', '#EC4899', '#06B6D4', '#10B981',
          '#F59E0B', '#EF4444', '#3B82F6', '#F4B400'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  // Research Statistics Chart Data (Line Chart)
  const researchStatsChartData = {
    labels: researchStats.researchByDepartment?.map(item => item.departmentName) || [],
    datasets: [
      {
        label: 'Research by Department',
        data: researchStats.researchByDepartment?.map(item => item.count) || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10
      }
    ]
  };

  // Activity Statistics Chart Data (Mixed Chart)
  const activityStatsChartData = {
    labels: ['Events', 'News'],
    datasets: [
      {
        label: 'Total',
        data: [activityStats.events?.total || 0, activityStats.news?.total || 0],
        backgroundColor: ['#F59E0B', '#EF4444'],
        borderColor: '#ffffff',
        borderWidth: 2
      },
      {
        label: 'This Year',
        data: [activityStats.events?.thisYear || 0, activityStats.news?.thisYear || 0],
        backgroundColor: ['#D97706', '#DC2626'],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  // Loading component
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004B87] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={refreshData}
            className="bg-[#004B87] text-white px-4 py-2 rounded hover:bg-[#003366] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div key={`dashboard-${language}-${isRTL}`} className="space-y-6">
      {/* Success Notification */}
      {refreshSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-slide-in-right">
          <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
          <span className="font-medium">✅ {t("dataRefreshedSuccessfully")}</span>
        </div>
      )}

      {/* Enhanced Header with Beautiful Gradient - Matching Courses Design */}
      <div className="relative bg-gradient-to-br from-[#004B87] via-[#1D3D6F] to-[#2C4F85] rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4B400] rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#16A085] rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-ping delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4 border border-white/30">
                <Activity className="h-8 w-8 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#F4B400] to-white bg-clip-text text-transparent">
                  {t("facultyOfEconomicsAnalyticsDashboard")}
                </h1>
                <p className="text-white/90 text-lg">
                  {t("realTimeInsights")}
                </p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <div className="w-2 h-2 bg-[#F4B400] rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">
                {t("liveDataUpdated")} • {overviewStats.totalStudents} {t("totalStudents")}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-right mb-3 sm:mb-0">
              <div className="text-2xl font-bold text-[#F4B400]">
                {overviewStats.totalStudents.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">
                {t("totalStudents")}
              </div>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className={`group bg-white/20 hover:bg-[#F4B400] px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-[#F4B400] hover:scale-105 hover:shadow-xl flex items-center ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              <RefreshCw className={`h-5 w-5 mr-2 transition-all duration-500 ${
                loading ? 'animate-spin text-white' : 'group-hover:rotate-180 group-hover:text-[#004B87] text-white'
              }`} />
              <span className="font-medium transition-all duration-300 group-hover:text-[#004B87] text-white">
                {loading ? t("refreshingData") : t("refreshData")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Dashboard Analytics - Matching Courses Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students Card */}
        <div className="group bg-gradient-to-br from-[#004B87] to-[#1D3D6F] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {t("totalStudents")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {overviewStats.totalStudents.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                <span className="text-green-300 text-xs">
                  +15% {t("thisYear")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-[#F4B400]">{overviewStats.totalStudents}</span>
            </div>
          </div>
        </div>

        {/* Total Courses Card */}
        <div className="group bg-gradient-to-br from-[#F4B400] to-[#E6A200] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#004B87] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {t("totalCourses")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {overviewStats.totalCourses}
              </p>
              <div className="flex items-center mt-2">
                <Award className="h-4 w-4 text-white/70 mr-1" />
                <span className="text-white/70 text-xs">
                  {t("academicPrograms")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{overviewStats.totalCourses}</span>
            </div>
          </div>
        </div>

        {/* Departments Card */}
        <div className="group bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {t("departments")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {overviewStats.totalDepartments}
              </p>
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 text-green-200 mr-1" />
                <span className="text-green-200 text-xs">
                  {t("academicUnits")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{overviewStats.totalDepartments}</span>
            </div>
          </div>
        </div>

        {/* Faculty Members Card */}
        <div className="group bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F4B400] rounded-full translate-y-8 -translate-x-8"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {t("facultyMembers")}
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {overviewStats.totalFaculty}
              </p>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-purple-200 text-xs">
                  {t("teachingStaff")}
                </span>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
              <span className="text-2xl font-bold text-white">{overviewStats.totalFaculty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row - Matching Courses Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Research & Events */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] p-2 rounded-lg mr-3">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {t("researchAndEvents")}
              </h3>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("researchPapers")}
              </span>
              <span className="text-lg font-bold text-[#EC4899]">{overviewStats.totalResearch}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("events")}
              </span>
              <span className="text-lg font-bold text-[#EC4899]">{overviewStats.totalEvents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("news")}
              </span>
              <span className="text-lg font-bold text-[#EC4899]">{overviewStats.totalNews}</span>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] p-2 rounded-lg mr-3">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {t("geographicDistribution")}
              </h3>
            </div>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("cities")}
              </span>
              <span className="text-lg font-bold text-[#06B6D4]">{cityData.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("faculties")}
              </span>
              <span className="text-lg font-bold text-[#06B6D4]">{overviewStats.totalFaculties}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("programs")}
              </span>
              <span className="text-lg font-bold text-[#06B6D4]">{overviewStats.activePrograms}</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-2 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {t("systemStatus")}
              </h3>
            </div>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("dataStatus")}
              </span>
              <span className="text-lg font-bold text-green-500">{t("active")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("lastUpdate")}
              </span>
              <span className="text-lg font-bold text-[#F59E0B]">{t("now")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {t("totalRecords")}
              </span>
              <span className="text-lg font-bold text-[#F59E0B]">{overviewStats.totalStudents + overviewStats.totalCourses + overviewStats.totalFaculty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#004B87] mb-3">
          {t("studentDistributionAnalytics")}
        </h2>
        <p className="text-gray-600 text-lg">
          {t("detailedInsights")}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-[#F4B400] to-[#16A085] mt-4 rounded-full mx-auto"></div>
      </div>

      {/* Enhanced Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Students by Department - Advanced Bar Chart */}
        <div className='group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] relative'>
          {/* Animated Background Pattern */}
          <div className='absolute inset-0 opacity-5'>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4B400] rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#004B87] rounded-full translate-y-12 -translate-x-12 animate-pulse delay-1000"></div>
          </div>

          <div className='relative bg-gradient-to-br from-[#004B87] via-[#1D3D6F] to-[#2C4F85] p-4 text-white'>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 border border-white/30">
                  <Users className='h-5 w-5 text-[#F4B400]' />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {t("studentsByDepartment")}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {t("academicDistribution")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#F4B400]">
                  {departmentData.length}
                </div>
                <div className="text-white/60 text-xs">
                  {t("depts")}
                </div>
              </div>
            </div>
          </div>
          <div className='p-4'>
            <div className='h-48 relative'>
              {departmentData.length > 0 ? (
                <>
                  <Bar
                    data={departmentChartData}
                    options={getAdvancedBarOptions()}
                    key={`dept-chart-${departmentData.length}`}
                  />
                  <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
                    {departmentData.length} {t("departments")} • {t("hoverForDetails")}
                  </div>
                </>
              ) : (
                <div className='flex items-center justify-center h-full text-gray-500'>
                  <div className='text-center'>
                    <Users className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                    <p>{t("noDepartmentData")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Students by City - Advanced Pie Chart */}
        <div className='group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] relative'>
          {/* Animated Background Pattern */}
          <div className='absolute inset-0 opacity-5'>
            <div className="absolute top-0 left-0 w-28 h-28 bg-[#004B87] rounded-full -translate-y-14 -translate-x-14 animate-bounce"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#F4B400] rounded-full translate-y-10 translate-x-10 animate-bounce delay-500"></div>
          </div>

          <div className='relative bg-gradient-to-br from-[#F4B400] via-[#E6A200] to-[#D97706] p-4 text-white'>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 border border-white/30">
                  <MapPin className='h-5 w-5 text-white' />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#004B87]">
                    {t("studentsByCity")}
                  </h3>
                  <p className="text-[#004B87]/80 text-xs">
                    {t("geographicDistribution")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">
                  {cityData.length}
                </div>
                <div className="text-white/60 text-xs">
                  {t("cities")}
                </div>
              </div>
            </div>
          </div>
          <div className='p-4'>
            <div className='h-48 relative'>
              {cityData.length > 0 ? (
                <>
                  <Pie
                    data={cityChartData}
                    options={getAdvancedPieOptions()}
                    key={`city-chart-${cityData.length}`}
                  />
                  <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
                    {cityData.length} {t("cities")} • {t("hoverForDetails")}
                  </div>
                </>
              ) : (
                <div className='flex items-center justify-center h-full text-gray-500'>
                  <div className='text-center'>
                    <MapPin className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                    <p>{t("noCityData")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enrollment Trends - Third Chart */}
        <div className='group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] relative'>
          {/* Animated Background Pattern */}
          <div className='absolute inset-0 opacity-5'>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#16A085] rounded-full -translate-y-12 translate-x-12 animate-bounce"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#F4B400] rounded-full translate-y-10 -translate-x-10 animate-bounce delay-700"></div>
          </div>

          <div className='relative bg-gradient-to-br from-[#16A085] via-[#1ABC9C] to-[#48C9B0] p-4 text-white'>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 border border-white/30">
                  <Calendar className='h-5 w-5 text-white' />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {t("enrollmentTrends")}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {t("yearOverYearGrowth")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">
                  {yearData.length}
                </div>
                <div className="text-white/60 text-xs">
                  {t("years")}
                </div>
              </div>
            </div>
          </div>
          <div className='p-4'>
            <div className='h-48 relative'>
              {yearData.length > 0 ? (
                <>
                  <Line
                    data={yearChartData}
                    options={getAdvancedLineOptions()}
                    key={`year-chart-${yearData.length}`}
                  />
                  <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
                    {yearData.length} {t("years")} • {t("hoverForTrends")}
                  </div>
                </>
              ) : (
                <div className='flex items-center justify-center h-full text-gray-500'>
                  <div className='text-center'>
                    <Calendar className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                    <p>{t("noEnrollmentData")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Enrollment Trends Chart */}
      <div className='group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01] relative'>
        {/* Animated Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div className='absolute top-1/2 left-1/4 w-12 h-12 bg-[#16A085] rounded-full animate-ping'></div>
          <div className='absolute bottom-1/3 right-1/3 w-8 h-8 bg-[#F4B400] rounded-full animate-ping delay-500'></div>
        </div>

        <div className='relative bg-gradient-to-br from-[#16A085] via-[#1ABC9C] to-[#48C9B0] p-4 text-white'>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 border border-white/30">
                <Calendar className='h-5 w-5 text-white' />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {t("enrollmentTrends")}
                </h3>
                <p className="text-white/80 text-xs">
                  {t("yearOverYearGrowth")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">
                {yearData.length}
              </div>
              <div className="text-white/60 text-xs">
                {t("years")}
              </div>
            </div>
          </div>
        </div>
        <div className='p-4'>
          <div className='h-48 relative'>
            {yearData.length > 0 ? (
              <>
                <Line
                  data={yearChartData}
                  options={getAdvancedLineOptions()}
                  key={`year-chart-${yearData.length}`}
                />
                <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
                  {yearData.length} {t("years")} • {t("hoverForTrends")}
                </div>
              </>
            ) : (
              <div className='flex items-center justify-center h-full text-gray-500'>
                <div className='text-center'>
                  <Calendar className='h-8 w-8 mx-auto mb-2 text-gray-300' />
                  <p className='text-sm'>{t("noEnrollmentData")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Title for Comprehensive Analytics */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#004B87] mb-3">
          {t("economicFacultyOverview")}
        </h2>
        <p className="text-gray-600 text-lg">
          {t("completeAnalytics")}
        </p>
        <div className="w-32 h-1 bg-gradient-to-r from-[#004B87] via-[#F4B400] to-[#16A085] mt-4 rounded-full mx-auto"></div>
      </div>

      {/* Enhanced Comprehensive Dashboard Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* University Overview Chart */}
        <div className='group bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden'>
          {/* Subtle Background Pattern */}
          <div className='absolute inset-0 opacity-5'>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4B400] rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#004B87] rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#F4B400] to-[#E6A200] p-3 rounded-xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Activity className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#004B87]">
                  {t("economicFacultyOverview")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("completeSystemMetrics")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {t("totalMetrics")}
              </div>
              <div className="text-lg font-bold text-[#F4B400]">
                9
              </div>
            </div>
          </div>
          <div className='h-64 relative'>
            <Doughnut
              data={overviewChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 15,
                      usePointStyle: true,
                      font: { size: 10 }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#F4B400',
                    bodyColor: '#ffffff',
                    borderColor: '#F4B400',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Course Statistics Chart */}
        <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-[#16A085] p-2 rounded-lg mr-3">
                <BookOpen className='h-5 w-5 text-white' />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#004B87]">
                  {t("coursesByDepartment")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("courseDistribution")}
                </p>
              </div>
            </div>
          </div>
          <div className='h-64 relative'>
            {courseStats.coursesByDepartment?.length > 0 ? (
              <Bar
                data={courseStatsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#16A085',
                      bodyColor: '#ffffff'
                    }
                  },
                  scales: {
                    y: { beginAtZero: true },
                    x: {
                      ticks: {
                        maxRotation: 45,
                        font: { size: 10 }
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className='flex items-center justify-center h-full text-gray-500'>
                <div className='text-center'>
                  <BookOpen className='h-12 w-12 mx-auto mb-2 text-gray-300' />
                  <p className='text-sm'>{t("noCourseData")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Statistics Chart */}
        <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-[#8B5CF6] p-2 rounded-lg mr-3">
                <Users className='h-5 w-5 text-white' />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#004B87]">{t("teachersByDepartment")}</h3>
                <p className="text-gray-600 text-sm">{t("facultyDistribution")}</p>
              </div>
            </div>
          </div>
          <div className='h-64 relative'>
            {teacherStats.teachersByDepartment?.length > 0 ? (
              <Pie
                data={teacherStatsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 10,
                        usePointStyle: true,
                        font: { size: 10 }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#8B5CF6',
                      bodyColor: '#ffffff'
                    }
                  }
                }}
              />
            ) : (
              <div className='flex items-center justify-center h-full text-gray-500'>
                <div className='text-center'>
                  <Users className='h-12 w-12 mx-auto mb-2 text-gray-300' />
                  <p className='text-sm'>{t("noTeacherData")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Research Statistics Chart */}
        <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`bg-[#10B981] p-2 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <Activity className='h-5 w-5 text-white' />
              </div>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <h3 className={`text-lg font-bold text-[#004B87] ${isRTL ? 'text-right' : 'text-left'}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t("researchByDepartment")}</h3>
                <p className={`text-gray-600 text-sm ${isRTL ? 'text-right' : 'text-left'}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t("researchDistribution")}</p>
              </div>
            </div>
          </div>
          <div className='h-64 relative'>
            {researchStats.researchByDepartment?.length > 0 ? (
              <Line
                data={researchStatsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      titleColor: '#10B981',
                      bodyColor: '#ffffff'
                    }
                  },
                  scales: {
                    y: { beginAtZero: true },
                    x: {
                      ticks: {
                        maxRotation: 45,
                        font: { size: 10 }
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className='flex items-center justify-center h-full text-gray-500'>
                <div className='text-center' dir={isRTL ? 'rtl' : 'ltr'}>
                  <Activity className='h-12 w-12 mx-auto mb-2 text-gray-300' />
                  <p className='text-sm' style={{ textAlign: 'center' }}>{t("noResearchData")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Statistics Chart */}
        <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`bg-[#F59E0B] p-2 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <Calendar className='h-5 w-5 text-white' />
              </div>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <h3 className={`text-lg font-bold text-[#004B87] ${isRTL ? 'text-right' : 'text-left'}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t("eventsAndNews")}</h3>
                <p className={`text-gray-600 text-sm ${isRTL ? 'text-right' : 'text-left'}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t("activityStatistics")}</p>
              </div>
            </div>
          </div>
          <div className='h-64 relative'>
            <Bar
              data={activityStatsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: { font: { size: 12 } }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#F59E0B',
                    bodyColor: '#ffffff'
                  }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        {/* Recent Activities Summary */}
        <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`bg-[#EC4899] p-2 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <Activity className='h-5 w-5 text-white' />
              </div>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <h3 className={`text-lg font-bold text-[#004B87] ${isRTL ? 'text-right' : 'text-left'}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t("recentActivities")}</h3>
                <p className={`text-gray-600 text-sm ${isRTL ? 'text-right' : 'text-left'}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t("latestUpdates")}</p>
              </div>
            </div>
          </div>
          <div className='space-y-4' dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t("newStudents")}</span>
              <span className='bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                {overviewStats.totalStudents}
              </span>
            </div>
            <div className={`flex items-center justify-between p-3 bg-green-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t("totalCourses")}</span>
              <span className='bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                {overviewStats.totalCourses}
              </span>
            </div>
            <div className={`flex items-center justify-between p-3 bg-purple-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t("researchPapers")}</span>
              <span className='bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                {overviewStats.totalResearch}
              </span>
            </div>
            <div className={`flex items-center justify-between p-3 bg-yellow-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`} style={{ textAlign: isRTL ? 'right' : 'left' }}>{t("activeEvents")}</span>
              <span className='bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                {overviewStats.totalEvents}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Data Summary */}
      <div
        className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`bg-[#6C5CE7] p-3 rounded-lg ${isRTL ? 'ml-4' : 'mr-4'}`}>
              <Activity className='h-6 w-6 text-white' />
            </div>
            <div
              className={`${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
              style={{
                direction: isRTL ? 'rtl' : 'ltr',
                textAlign: isRTL ? 'right' : 'left'
              }}
            >
              <h2
                className={`text-xl font-bold text-[#004B87] ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
                style={{
                  direction: isRTL ? 'rtl' : 'ltr',
                  textAlign: isRTL ? 'right' : 'left'
                }}
              >
                {t("quickOverview")}
              </h2>
              <p
                className={`text-gray-600 text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
                style={{
                  direction: isRTL ? 'rtl' : 'ltr',
                  textAlign: isRTL ? 'right' : 'left'
                }}
              >
                {t("keyStatistics")}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${isRTL ? 'rtl' : 'ltr'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Top Departments */}
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h3
              className={`text-lg font-semibold text-[#004B87] mb-3 flex items-center ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              <Users className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span
                className={`${isRTL ? 'text-right' : 'text-left'}`}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              >
                {t("topDepartments")}
              </span>
            </h3>
            <div className='space-y-2'>
              {departmentData.slice(0, 3).map((dept, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span
                    className={`font-medium text-gray-700 text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ textAlign: isRTL ? 'right' : 'left' }}
                  >
                    {dept.departmentName}
                  </span>
                  <span className='bg-[#004B87] text-white px-3 py-1 rounded-full text-xs font-bold'>
                    {dept.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h3
              className={`text-lg font-semibold text-[#004B87] mb-3 flex items-center ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              <MapPin className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span
                className={`${isRTL ? 'text-right' : 'text-left'}`}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              >
                {t("topCities")}
              </span>
            </h3>
            <div className='space-y-2'>
              {cityData.slice(0, 3).map((city, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span
                    className={`font-medium text-gray-700 text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ textAlign: isRTL ? 'right' : 'left' }}
                  >
                    {city.city}
                  </span>
                  <span className='bg-[#F4B400] text-[#004B87] px-3 py-1 rounded-full text-xs font-bold'>
                    {city.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Years */}
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h3
              className={`text-lg font-semibold text-[#004B87] mb-3 flex items-center ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              <Calendar className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span
                className={`${isRTL ? 'text-right' : 'text-left'}`}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              >
                {t("recentYears")}
              </span>
            </h3>
            <div className='space-y-2'>
              {yearData.slice(0, 3).map((year, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span
                    className={`font-medium text-gray-700 text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{ textAlign: isRTL ? 'right' : 'left' }}
                  >
                    {year.year}
                  </span>
                  <span className='bg-[#16A085] text-white px-3 py-1 rounded-full text-xs font-bold'>
                    {year.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
