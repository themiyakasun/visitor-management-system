/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useDeviceStore } from '@/stores/devicesStore';
import { useEffect, useState } from 'react';

const Device = () => {
  const { getAllDevices, allDevices } = useDeviceStore();
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [visibleAddForm, setVisibleAddForm] = useState(false);
  const [visibleEditForm, setVisibleEditForm] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState<any>(null);
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');

  const [selectedDevices, setSelectedDevices] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getAllDevices();
  }, [getAllDevices]);

  const selectDevice = (device: any) => {
    if (selectedDevices.includes(device.ID)) {
      setSelectedDevices(selectedDevices.filter((id) => id !== device.ID));
    } else {
      setSelectedDevices([...selectedDevices, device.ID]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedDevices([]);
    } else {
      const filteredIds = filteredDevices.map((d) => d.ID);
      setSelectedDevices(filteredIds);
    }
    setSelectAll(!selectAll);
  };

  const isSelected = (device: any) => selectedDevices.includes(device.ID);

  const filteredDevices = allDevices.filter((device: any) =>
    searchKey
      ? device.DevSN?.toLowerCase().includes(searchKey.toLowerCase())
      : true
  );

  const totalPages = Math.ceil(filteredDevices.length / pageSize);

  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const status = (date: any) => {
    const dateNow = new Date();
    const dateLast = new Date(date);
    const diffInMilliseconds = Math.abs(dateNow.getTime() - dateLast.getTime());
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    return diffInMinutes < 5;
  };

  return (
    <div className='devices'>
      {loading && <Loader />}
      <div className='mb-4'>
        <Card>
          <CardContent>
            <div className='flex items-center gap-4'>
              <div>
                <Input
                  id='searchDevices'
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder='Search by serial number'
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>
                  <input
                    type='checkbox'
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </TableCell>
                {role === 'admin' && <TableCell>ID</TableCell>}
                <TableCell>Status</TableCell>
                <TableCell>Device Identity</TableCell>
                <TableCell>Device Info</TableCell>
                <TableCell>Versions</TableCell>
                <TableCell>Counts</TableCell>
                <TableCell>Belongs to</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedDevices.map((device: any) => (
                <TableRow key={device.ID}>
                  <TableCell className='text-center'>
                    <input
                      type='checkbox'
                      checked={isSelected(device)}
                      onChange={() => selectDevice(device)}
                    />
                  </TableCell>
                  {role === 'admin' && <TableCell>{device.ID}</TableCell>}
                  <TableCell className='text-center'>
                    <div
                      className={`w-3 h-3 rounded-full mx-auto blink ${
                        status(device.LastUpdateTime)
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    />
                  </TableCell>
                  <TableCell>
                    <div>SN: {device.DevSN || 'Not Set'}</div>
                    <div>Name: {device.DevName || 'Not Set'}</div>
                  </TableCell>
                  <TableCell>
                    <div>IP: {device.DevIp || 'Not Set'}</div>
                    <div>Last Update: {device.LastUpdateTime || 'Not Set'}</div>
                    {role === 'admin' && (
                      <div>Expire: {device.ExpireDate || 'Not Set'}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>Fingerprint: {device.DevFPVersion || 'Not Set'}</div>
                    <div>Face: {device.DevFaceVersion || 'Not Set'}</div>
                    <div>
                      Firmware: {device.DevFirmwareVersion || 'Not Set'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>Users: {device.UserCount || 0}</div>
                    <div>Attendance: {device.AttCount || 0}</div>
                    <div>Fingerprints: {device.FpCount || 0}</div>
                    <div>
                      Faces: {device.FaceCount || 0}/{device.FaceCapacity || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>Company: {device.CompanyName}</div>
                    <div>Area: {device.AreaName}</div>
                    <div>Location: {device.LocationName}</div>
                    <div>Zone: {device.ZoneName}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className='flex justify-end mt-6'>
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                />
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      isActive={currentPage === idx + 1}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                />
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Device;
