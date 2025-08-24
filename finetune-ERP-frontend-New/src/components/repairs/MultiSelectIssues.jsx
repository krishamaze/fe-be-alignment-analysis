import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';

export default function MultiSelectIssues({ issues = [], value = [], onChange }) {
  const selectedLabels = value
    .map((id) => issues.find((i) => i.id === id)?.name)
    .filter(Boolean);
  return (
    <Listbox value={value} onChange={onChange} multiple>
      <Listbox.Label className="label">Issues</Listbox.Label>
      <div className="relative mt-1">
        <Listbox.Button className="input">
          {selectedLabels.length ? selectedLabels.join(', ') : 'Select issues'}
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white shadow">
            {issues.map((issue) => (
              <Listbox.Option
                key={issue.id}
                value={issue.id}
                className={({ active }) =>
                  `cursor-pointer select-none p-2 ${active ? 'bg-gray-100' : ''}`
                }
              >
                {({ selected }) => (
                  <span className={selected ? 'font-medium' : 'font-normal'}>{issue.name}</span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
