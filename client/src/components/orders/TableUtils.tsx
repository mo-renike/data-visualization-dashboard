export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-[#64748B] tracking-wider"
  >
    {children}
  </th>
);

export const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td
    className="px-6 py-4 whitespace-nowrap text-xs 
    text-[#0F172A] font-semibold"
  >
    {children}
  </td>
);

export const TableBtn = ({
  onClick,
  variant = "primary",
  children,
}: {
  onClick?: () => void;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) => {
  const styles = {
    primary:
      "flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
    secondary: "text-gray-400 hover:text-gray-600",
  };

  return (
    <button onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
};
