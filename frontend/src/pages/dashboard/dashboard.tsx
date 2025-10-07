import EmployeeCountTable from '@/components/tables/employee-count-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDepartmentStore } from '@/stores/departmentStore';
import { useGateStore } from '@/stores/gateStore';
import { CarFront, UserCheck, UserPlus, Users } from 'lucide-react';
import { useEffect } from 'react';

const Dashboard = () => {
  const { dashboardSummary, getDashboardSummary } = useGateStore();
  const { getDepartmentEmployeeCount, employeeCount } = useDepartmentStore();

  useEffect(() => {
    const fetchData = async () => {
      await getDepartmentEmployeeCount();
    };
    fetchData();
  }, [getDepartmentEmployeeCount]);

  useEffect(() => {
    const fetchData = async () => {
      await getDashboardSummary();
    };
    fetchData();
  }, [getDashboardSummary]);

  const summaryItems = [
    {
      title: 'Total Logs',
      value: dashboardSummary?.totalLogs ?? 0,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Employees',
      value: dashboardSummary?.totalEmployees ?? 0,
      icon: UserCheck,
      color: 'text-green-600',
    },
    {
      title: 'Visitors',
      value: dashboardSummary?.totalVisitors ?? 0,
      icon: UserPlus,
      color: 'text-yellow-600',
    },
    {
      title: 'Vehicles',
      value: dashboardSummary?.totalVehicles ?? 0,
      icon: CarFront,
      color: 'text-red-600',
    },
  ];
  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='grid auto-rows-min gap-4 md:grid-cols-4'>
        {summaryItems.map((item) => (
          <Card
            key={item.title}
            className='rounded-2xl shadow-md hover:shadow-lg transition-all'
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <CardTitle className='text-sm font-medium'>
                {item.title}
              </CardTitle>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <EmployeeCountTable data={employeeCount} />
      <div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min' />
    </div>
  );
};

export default Dashboard;
