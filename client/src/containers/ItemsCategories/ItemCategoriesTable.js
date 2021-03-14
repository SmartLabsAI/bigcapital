import React from 'react';

import { useItemsCategoriesTableColumns, ActionMenuList } from './components';
import DataTable from 'components/DataTable';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import { useItemsCategoriesContext } from './ItemsCategoriesProvider';

import withAlertActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Items categories table.
 */
function ItemsCategoryTable({
  // #ownProps
  tableProps,

  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,
}) {
  // Items categories context.
  const {
    isCategoriesLoading,
    isCategoriesFetching,
    itemsCategories,
  } = useItemsCategoriesContext();

  // Table columns.
  const columns = useItemsCategoriesTableColumns();

  // Handle delete Item.
  const handleDeleteCategory = ({ id }) => {
    openAlert('item-category-delete', { itemCategoryId: id });
  };

  // Handle Edit item category.
  const handleEditCategory = (category) => {
    openDialog('item-category-form', { action: 'edit', id: category.id });
  };

  return (
    <DataTable
      noInitialFetch={true}
      columns={columns}
      data={itemsCategories}
      loading={isCategoriesLoading}
      headerLoading={isCategoriesLoading}
      progressBarLoading={isCategoriesFetching}
      expandable={true}
      sticky={true}
      selectionColumn={true}
      TableLoadingRenderer={TableSkeletonRows}
      noResults={'There is no items categories in table yet.'}
      payload={{
        onDeleteCategory: handleDeleteCategory,
        onEditCategory: handleEditCategory,
      }}
      ContextMenu={ActionMenuList}
      {...tableProps}
    />
  );
}

export default compose(withDialogActions, withAlertActions)(ItemsCategoryTable);