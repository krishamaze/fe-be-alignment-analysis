import { useParams } from 'react-router-dom';

function WorkledgerDetails() {
  const { id } = useParams();
  return (
    <div className="p-4">
      <p className="text-gray-800">Details for {id} coming soon.</p>
    </div>
  );
}

export default WorkledgerDetails;
