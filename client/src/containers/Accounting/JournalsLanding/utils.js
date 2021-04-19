import React from 'react';
import { formatMessage } from 'services/intl';
import moment from 'moment';
import {
  NoteAccessor,
  StatusAccessor,
  DateAccessor,
  AmountAccessor,
} from './components';

/**
 * Retrieve the manual journals columns.
 */
export const useManualJournalsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: formatMessage({ id: 'date' }),
        accessor: DateAccessor,
        width: 115,
        className: 'date',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: AmountAccessor,
        className: 'amount',
        width: 115,
      },
      {
        id: 'journal_number',
        Header: formatMessage({ id: 'journal_no' }),
        accessor: (row) => `#${row.journal_number}`,
        className: 'journal_number',
        width: 100,
      },
      {
        id: 'journal_type',
        Header: formatMessage({ id: 'journal_type' }),
        accessor: 'journal_type',
        width: 110,
        className: 'journal_type',
      },
      {
        id: 'status',
        Header: formatMessage({ id: 'publish' }),
        accessor: (row) => StatusAccessor(row),
        width: 95,
        className: 'status',
      },
      {
        id: 'note',
        Header: formatMessage({ id: 'note' }),
        accessor: NoteAccessor,
        disableSortBy: true,
        width: 85,
        className: 'note',
      },
      {
        id: 'created_at',
        Header: formatMessage({ id: 'created_at' }),
        accessor: (r) => moment(r.created_at).format('YYYY MMM DD'),
        width: 125,
        className: 'created_at',
      },
    ],
    [],
  );
};
