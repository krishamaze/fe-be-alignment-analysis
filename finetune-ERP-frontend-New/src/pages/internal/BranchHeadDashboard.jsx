import GenericDashboard from './GenericDashboard';
import {
  HiOutlineClipboardCheck,
  HiOutlineQrcode,
  HiOutlineDatabase,
  HiOutlineCreditCard,
} from 'react-icons/hi';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';

const branchHeadFeatures = [
  {
    title: 'Workledger',
    icon: <HiOutlineClipboardDocumentList size={28} />,
    status: 'live',
    to: '/workledger',
  },
  {
    title: 'Giveaway Redemption',
    icon: <HiOutlineClipboardCheck size={28} />,
    status: 'live',
    to: '/giveaway-redemption',
  },
  { title: 'Invoice', icon: <HiOutlineClipboardCheck size={28} /> },
  { title: 'Price Check', icon: <HiOutlineQrcode size={28} /> },
  { title: 'EMI Info' },
  { title: 'Backcase Info' },
  { title: 'Temper Manager' },
  { title: 'Service Entry', icon: <HiOutlineDatabase size={28} /> },
  { title: 'Inventory' },
  { title: 'RPay', icon: <HiOutlineCreditCard size={28} /> },
];

export default function BranchHeadDashboard() {
  return (
    <GenericDashboard
      title="Branch Head Dashboard"
      features={branchHeadFeatures}
    />
  );
}
