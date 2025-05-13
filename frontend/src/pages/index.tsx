import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { employeeApi, projectApi, trainingApi } from '@/lib/api';
import { ChartBarIcon, UserGroupIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

interface DashboardStats {
  totalEmployees: number;
  onBench: number;
  activeProjects: number;
  activeTrainings: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    onBench: 0,
    activeProjects: 0,
    activeTrainings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data
        const employeesResponse = await employeeApi.getAll();
        const projectsResponse = await projectApi.getAll();
        const trainingsResponse = await trainingApi.getAll();

        // Calculate statistics
        const totalEmployees = employeesResponse.data.length;
        const onBench = employeesResponse.data.filter(
          (emp: any) => emp.currentStatus === 'bench'
        ).length;
        const activeProjects = projectsResponse.data.filter(
          (proj: any) => proj.status === 'active'
        ).length;
        const activeTrainings = trainingsResponse.data.filter(
          (training: any) => training.status === 'ongoing'
        ).length;

        setStats({
          totalEmployees,
          onBench,
          activeProjects,
          activeTrainings,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats_cards = [
    {
      name: 'Total Employees',
      value: stats.totalEmployees,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'On Bench',
      value: stats.onBench,
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Active Projects',
      value: stats.activeProjects,
      icon: BriefcaseIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Active Trainings',
      value: stats.activeTrainings,
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
    },
  ];

  if (error) {
    return (
      <Layout>
        <div className="text-red-600 text-center py-8">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats_cards.map((stat) => (
            <div key={stat.name} className="card overflow-hidden">
              <div className="flex items-center">
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </dd>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : (
                <p className="text-gray-500">No recent activities</p>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Trainings</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : (
                <p className="text-gray-500">No upcoming trainings</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 