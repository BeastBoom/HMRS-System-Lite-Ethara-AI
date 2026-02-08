interface DepartmentSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

const DEPARTMENTS = [
  'HR',
  'Engineering', 
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Management'
];

export const DepartmentSelector = ({ value, onChange, disabled, error }: DepartmentSelectorProps) => {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`block w-full rounded-md shadow-sm focus:ring-brand-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-50 ${
          error 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500' 
            : 'border-gray-300 focus:border-brand-500'
        }`}
      >
        <option value="">Select Department</option>
        {DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </div>
  );
};
