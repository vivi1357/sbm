import { useState } from 'react';
import Layout from '@/components/Layout';
import useSWR from 'swr';
import { employeeApi } from '@/lib/api';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface Employee {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  currentStatus: 'bench' | 'assigned' | 'training';
  department: string;
  location: string;
}

const statusColors = {
  bench: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-green-100 text-green-800',
  training: 'bg-blue-100 text-blue-800',
};

export default function Employees() {
  const [filter, setFilter] = useState('all');
  const { data: employees, error } = useSWR<Employee[]>('/employees', () =>
    employeeApi.getAll().then((res) => res.data)
  );

  if (error) return <div>Failed to load employees</div>;
  if (!employees) return <div>Loading...</div>;

  const filteredEmployees = employees.filter((employee) => {
    if (filter === 'all') return true;
    return employee.currentStatus === filter;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
          <button className="btn-primary">Add Employee</button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md ${
                  filter === 'all'
                    ? 'bg-primary-100 text-primary-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  filter === 'bench'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter('bench')}
              >
                On Bench
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  filter === 'assigned'
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter('assigned')}
              >
                Assigned
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  filter === 'training'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setFilter('training')}
              >
                In Training
              </button>
            </div>
          </div>

          <ul role="list" className="divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <li key={employee._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {employee.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{employee.email}</p>
                    <div className="flex items-center mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[employee.currentStatus]
                        }`}
                      >
                        {employee.currentStatus.charAt(0).toUpperCase() +
                          employee.currentStatus.slice(1)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {employee.department} • {employee.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary">View Profile</button>
                    <button className="btn-primary">Assign</button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
} 