import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'style/pages/FinancialStatements/ContactsTransactions.scss';

import { FinancialStatement } from 'components';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import VendorsTransactionsHeader from './VendorsTransactionsHeader';
import VendorsTransactionsActionsBar from './VendorsTransactionsActionsBar';
import VendorsTransactionsTable from './VendorsTransactionsTable';

import withVendorsTransactionsActions from './withVendorsTransactionsActions';
import withSettings from 'containers/Settings/withSettings';

import { VendorsTransactionsProvider } from './VendorsTransactionsProvider';
import { VendorsTransactionsLoadingBar } from './components';

import { compose } from 'utils';

/**
 * Vendors transactions.
 */
function VendorsTransactions({
  // #withPreferences
  organizationName,

  //#withVendorsTransactionsActions
  toggleVendorsTransactionsFilterDrawer,
}) {
  // filter
  const [filter, setFilter] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    toDate: moment().endOf('year').format('YYYY-MM-DD'),
  });

  const handleFilterSubmit = (filter) => {
    const _filter = {
      ...filter,
      fromDate: moment(filter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(filter.toDate).format('YYYY-MM-DD'),
    };
    setFilter({ ..._filter });
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
    setFilter({
      ...filter,
      numberFormat: values,
    });
  };

  useEffect(
    () => () => {
      toggleVendorsTransactionsFilterDrawer(false);
    },
    [toggleVendorsTransactionsFilterDrawer],
  );

  return (
    <VendorsTransactionsProvider filter={filter}>
      <VendorsTransactionsActionsBar
        numberFormat={filter.numberFormat}
        onNumberFormatSubmit={handleNumberFormatSubmit}
      />
      <VendorsTransactionsLoadingBar />
      <DashboardPageContent>
        <FinancialStatement>
          <div className={'financial-statement--transactions'}>
            <VendorsTransactionsHeader
              pageFilter={filter}
              onSubmitFilter={handleFilterSubmit}
            />
            <div class="financial-statement__body">
              <VendorsTransactionsTable companyName={organizationName} />
            </div>
          </div>
        </FinancialStatement>
      </DashboardPageContent>
    </VendorsTransactionsProvider>
  );
}
export default compose(
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
  withVendorsTransactionsActions,
)(VendorsTransactions);