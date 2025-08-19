import { useParams } from 'react-router-dom';

function WorkledgerDetails() {
  const { id } = useParams();
  return (
    <div className="p-4">
      <p className="text-gray-800">TODO: details for {id}</p>
    </div>
  );
}

export default WorkledgerDetails;
