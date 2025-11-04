import { useAppSelector } from '@/redux/hook';
import { selectAuthRole } from '@/redux/slice/authSlice';
import CardItem from '@/components/dashboard/components/CardItem';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';

const tiles = {
  system_admin: [
    {
      title: 'System admin action coming soon',
      icon: <HiOutlineClipboardDocumentList size={28} />,
      disabled: true,
    },
  ],
  branch_head: [
    {
      title: 'Branch head action coming soon',
      icon: <HiOutlineClipboardDocumentList size={28} />,
      disabled: true,
    },
  ],
  advisor: [
    {
      title: 'Advisor action coming soon',
      icon: <HiOutlineClipboardDocumentList size={28} />,
      disabled: true,
    },
  ],
};

function Workledger() {
  const role = useAppSelector(selectAuthRole);
  const items = tiles[role] || [];

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <CardItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Workledger;
