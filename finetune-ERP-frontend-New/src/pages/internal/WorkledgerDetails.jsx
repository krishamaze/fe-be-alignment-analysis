import { useParams } from 'react-router-dom';
import ComingSoon from '../../components/common/ComingSoon';

function WorkledgerDetails() {
  const { id } = useParams();
  return <ComingSoon>Details for {id} coming soon.</ComingSoon>;
}

export default WorkledgerDetails;
