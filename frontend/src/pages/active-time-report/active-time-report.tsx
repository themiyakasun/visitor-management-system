import Loader from '@/components/loader';
import GateLogTable from '@/components/tables/gate-log-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGateStore } from '@/stores/gateStore';
import { usePersonStore } from '@/stores/personStore';
import { useVehicleStore } from '@/stores/vehicleStore';
import { ArrowDownToLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const ActiveTimeReport = () => {
  const navigate = useNavigate();
  const { persons, getAllPersons } = usePersonStore();
  const { vehicles, getAllVehicles } = useVehicleStore();
  const { gatelogs, generateActiveReport, pagination, isLoading } =
    useGateStore();

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [type, setType] = useState('in');
  const [personId, setPersonId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [timeGap, setTimeGap] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [personSearch, setPersonSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  useEffect(() => {
    getAllPersons({ page: 1, limit: 50, search: personSearch, type: 'all' });
    getAllVehicles({ page: 1, limit: 50, search: vehicleSearch });
  }, [getAllPersons, getAllVehicles, personSearch, vehicleSearch]);

  useEffect(() => {
    const fetchGateLogs = async () => {
      await generateActiveReport({
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        type: type || undefined,
        personId: personId || undefined,
        vehicleId: vehicleId || undefined,
        timeGap: timeGap || undefined,
        page: currentPage || undefined,
        limit: itemsPerPage || undefined,
        format: 'json',
      });
    };

    fetchGateLogs();
  }, [
    fromDate,
    toDate,
    type,
    personId,
    vehicleId,
    timeGap,
    currentPage,
    itemsPerPage,
    generateActiveReport,
  ]);

  const buildParams = () => {
    return {
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      type: type || undefined,
      personId: personId || undefined,
      vehicleId: vehicleId || undefined,
      timeGap: timeGap || undefined,
      page: currentPage || undefined,
      limit: itemsPerPage || undefined,
      format: 'json',
    };
  };

  const generateReport = async () => {
    const response = await generateActiveReport({
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      type: type || undefined,
      personId: personId || undefined,
      vehicleId: vehicleId || undefined,
      timeGap: timeGap || undefined,
      page: currentPage || undefined,
      limit: itemsPerPage || undefined,
      format: 'pdf',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    console.log(url);
    navigate(`/report-viewer?url=${encodeURIComponent(url)}`);
  };

  const fetchGateLogs = async () => {
    await generateActiveReport(buildParams());
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-semibold'>Active Time Report</h1>
          <p className='text-sm text-muted-foreground'>
            Manage organizational Active Time Report
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Button onClick={generateReport}>
            <ArrowDownToLine />
            Export
          </Button>
        </div>
      </div>

      <div className='mb-4'>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4'>
              <div>
                <Label className='mb-2'>From Date</Label>
                <Input
                  type='date'
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div>
                <Label className='mb-2'>To Date</Label>
                <Input
                  type='date'
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div>
                <Label className='mb-2'>Time Gap (hours)</Label>
                <Input
                  type='number'
                  min={0}
                  placeholder='e.g. 2'
                  value={timeGap}
                  className='w-full'
                  onChange={(e) => setTimeGap(e.target.value)}
                />
              </div>

              <div className='w-1/6'>
                <Label className='mb-2'>Person</Label>
                <Select value={personId} onValueChange={(v) => setPersonId(v)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Person' />
                  </SelectTrigger>
                  <SelectContent>
                    <div className='p-2'>
                      <Input
                        placeholder='Search...'
                        value={personSearch}
                        onChange={(e) => setPersonSearch(e.target.value)}
                        className='mb-2'
                      />
                    </div>
                    {persons.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='w-1/6'>
                <Label className='mb-2'>Vehicle</Label>
                <Select
                  value={vehicleId}
                  onValueChange={(v) => setVehicleId(v)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Vehicle' />
                  </SelectTrigger>
                  <SelectContent>
                    <div className='p-2'>
                      <Input
                        placeholder='Search...'
                        value={vehicleSearch}
                        onChange={(e) => setVehicleSearch(e.target.value)}
                        className='mb-2'
                      />
                    </div>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.numberPlate || v.driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex gap-2 mt-4'>
              <Button onClick={fetchGateLogs} disabled={isLoading}>
                {isLoading ? <Loader /> : 'Apply Filters'}
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                  setType('in');
                  setPersonId('');
                  setVehicleId('');
                  setTimeGap('');
                  fetchGateLogs();
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {gatelogs !== undefined && (
        <GateLogTable
          data={gatelogs}
          total={pagination.total}
          page={pagination.page}
          pageSize={pagination.limit}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default ActiveTimeReport;
