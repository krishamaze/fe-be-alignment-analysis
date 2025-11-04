import { useParams } from 'react-router-dom';
import { useGetAttendanceByIdQuery } from '@/api/erpApi';

const DetailRow = ({ label, value }) => {
  if (value === null || value === undefined || value === '') {
    value = <span className="text-gray-400">N/A</span>;
  }
  return (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 px-3 sm:px-0 even:bg-gray-50 dark:even:bg-gray-800/50">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-gray-200">
        {value}
      </dd>
    </div>
  );
};

function WorkledgerDetails() {
  const { id } = useParams();
  const { data, error, isLoading } = useGetAttendanceByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading attendance details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 rounded-md bg-red-50 dark:bg-red-900/20">
        <h1 className="text-lg font-bold text-red-700 dark:text-red-400">
          An Error Occurred
        </h1>
        <p className="text-red-600 dark:text-red-300 mt-1">
          {error.data?.detail || 'Failed to load attendance details.'}
        </p>
      </div>
    );
  }

  if (!data) {
    return <p className="p-4 text-center">No data found for this record.</p>;
  }

  const userName = data.user
    ? `${data.user.first_name || ''} ${data.user.last_name || ''} (${
        data.user.username
      })`.trim()
    : 'N/A';

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700/50">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Attendance Record #{data.id}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Details for attendance on {new Date(data.date).toLocaleDateString()}.
          </p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <dl>
            <DetailRow label="User" value={userName} />
            <DetailRow label="Store" value={data.store?.name} />
            <DetailRow label="Shift" value={data.shift?.name} />
            <DetailRow
              label="Status"
              value={<span className="font-mono text-xs uppercase">{data.status}</span>}
            />
            <DetailRow
              label="Check-in"
              value={data.check_in && new Date(data.check_in).toLocaleString()}
            />
            <DetailRow
              label="Check-out"
              value={data.check_out && new Date(data.check_out).toLocaleString()}
            />
            <DetailRow label="Worked Minutes" value={data.worked_minutes} />
            <DetailRow label="OT Minutes (Approved)" value={data.ot_minutes} />
            <DetailRow
              label="Notes"
              value={
                data.notes && (
                  <pre className="whitespace-pre-wrap font-sans">
                    {data.notes}
                  </pre>
                )
              }
            />
          </dl>
        </div>
      </div>
    </div>
  );
}

export default WorkledgerDetails;
