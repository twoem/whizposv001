import React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, className = '', ...props }) => (
  <div className="w-full overflow-x-auto">
    <table className={`w-full text-sm ${className}`} {...props}>
      {children}
    </table>
  </div>
);

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = ({ children, ...props }) => (
  <thead className="bg-slate-700/50 border-b border-slate-600" {...props}>
    {children}
  </thead>
);

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className = '', ...props }) => (
  <tr className={`border-b border-slate-700 hover:bg-slate-700/30 transition-colors ${className}`} {...props}>
    {children}
  </tr>
);

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  header?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({ children, header = false, className = '', ...props }) => {
  const Cell = header ? 'th' : 'td';
  return (
    <Cell
      className={`px-4 py-3 text-left ${header ? 'font-semibold text-slate-200' : 'text-slate-400'} ${className}`}
      {...props}
    >
      {children}
    </Cell>
  );
};
