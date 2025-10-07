import { usePersonStore } from '@/stores/personStore';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const BulkUploadPerson = () => {
  const [file, setFile] = useState<File | null>(null);
  const { bulkUploadPersons, isLoading } = usePersonStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first');
    await bulkUploadPersons(file);
    setFile(null);
  };

  return (
    <div className='flex items-center gap-2'>
      <Input type='file' accept='.csv,.xlsx,.xls' onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={isLoading || !file}>
        {isLoading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
};

export default BulkUploadPerson;
