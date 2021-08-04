import React from 'react';
import intl from 'react-intl-universal';
import { MoneyFieldCell, DataTableEditable } from 'components';
import { compose, updateTableRow } from 'utils';

/**
 * Allocate landed cost entries table.
 */
export default function AllocateLandedCostEntriesTable({
  onUpdateData,
  entries,
}) {
  // Allocate landed cost entries table columns.
  const columns = React.useMemo(
    () => [
      {
        Header: intl.get('item'),
        accessor: 'item.name',
        disableSortBy: true,
        width: '150',
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity',
        disableSortBy: true,
        width: '100',
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        disableSortBy: true,
        width: '100',
      },
      {
        Header: intl.get('amount'),
        accessor: 'amount',
        disableSortBy: true,
        width: '100',
      },
      {
        Header: intl.get('cost'),
        accessor: 'cost',
        width: '150',
        Cell: MoneyFieldCell,
        disableSortBy: true,
      },
    ],
    [],
  );

  // Handle update data.
  const handleUpdateData = React.useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(updateTableRow(rowIndex, columnId, value))(
        entries,
      );
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );

  return (
    <DataTableEditable
      columns={columns}
      data={entries}
      payload={{
        errors: [],
        updateData: handleUpdateData,
      }}
    />
  );
}