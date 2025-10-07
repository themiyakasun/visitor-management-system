import { Button } from '@/components/ui/button';
import { pdfjs } from 'react-pdf';
import { useSearchParams } from 'react-router';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReportViewer = () => {
  // const [numPages, setNumPages] = useState<number | null>(null);
  const searchParams = useSearchParams()[0];
  const fileUrl = searchParams.get('url');

  return (
    <div className='flex flex-col items-center w-full h-screen p-4 gap-4'>
      <div className='flex gap-2'>
        <a href={fileUrl!} download='department-report.pdf'>
          <Button>Download PDF</Button>
        </a>
        <Button onClick={() => window.history.back()}>Back</Button>
      </div>

      <div className='overflow-auto w-full flex-1'>
        <iframe
          src={fileUrl!}
          width='100%'
          height='800px'
          title='PDF Viewer'
        ></iframe>
      </div>
    </div>
  );
};

export default ReportViewer;
