import React from 'react';
import intl from 'react-intl-universal';
import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
  Tag,
  Intent,
} from '@blueprintjs/core';
import {
  Icon,
  FormattedMessage as T,
  FormatNumberCell,
  Choose,
} from '../../../components';

/**
 * Retrieve vendor credit readonly details entries table columns.
 */
export const useVendorCreditReadonlyEntriesTableColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('product_and_service'),
        accessor: 'item.name',
        width: 150,
        className: 'item',
        disableSortBy: true,
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        className: 'description',
        disableSortBy: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity',
        Cell: FormatNumberCell,
        width: 100,
        align: 'right',
        disableSortBy: true,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        Cell: FormatNumberCell,
        width: 100,
        align: 'right',
        disableSortBy: true,
      },
      {
        Header: intl.get('amount'),
        accessor: 'amount',
        Cell: FormatNumberCell,
        width: 100,
        align: 'right',
        disableSortBy: true,
      },
    ],
    [],
  );

/**
 * Vendor note more actions menu.
 * @returns {React.JSX}
 */
export const VendorCreditMenuItem = ({ payload: { onReconcile } }) => {
  return (
    <Popover
      minimal={true}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      content={
        <Menu>
          <MenuItem
            onClick={onReconcile}
            text={intl.get('vendor_credits.action.reconcile_with_bills')}
          />
        </Menu>
      }
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
};

/**
 * Vendor Credit details status.
 * @returns {React.JSX}
 */
export function VendorCreditDetailsStatus({ vendorCredit }) {
  return (
    <Choose>
      <Choose.When condition={vendorCredit.is_open}>
        <Tag intent={Intent.WARNING} round={true}>
          <T id={'open'} />
        </Tag>
      </Choose.When>

      <Choose.When condition={vendorCredit.is_closed}>
        <Tag intent={Intent.SUCCESS} round={true}>
          <T id={'closed'} />
        </Tag>
      </Choose.When>

      <Choose.When condition={vendorCredit.is_draft}>
        <Tag intent={Intent.NONE} round={true} minimal={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.When>
    </Choose>
  );
}