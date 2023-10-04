import React, { useCallback, useState } from 'react';
import { ArrayLayoutProps, rankWith, isPrimitiveArrayControl } from '@jsonforms/core';
import { withJsonFormsArrayLayoutProps } from '@jsonforms/react';
import { Hidden } from '@mui/material';
import { DeleteDialog, MaterialTableControl } from '@jsonforms/material-renderers';

export const FlatArrayWithDescription = (props) => {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState(undefined);
  const [rowData, setRowData] = useState(undefined);
  const { removeItems, visible } = props;

  const openDeleteDialog = useCallback((p, rowIndex) => {
    setOpen(true);
    setPath(p);
    setRowData(rowIndex);
  }, [setOpen, setPath, setRowData]);
  const deleteCancel = useCallback(() => setOpen(false), [setOpen]);
  const deleteConfirm = useCallback(() => {
    const p = path.substring(0, path.lastIndexOf(('.')));
    removeItems(p, [rowData])();
    setOpen(false);
  }, [setOpen, path, rowData]);
  const deleteClose = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Hidden xsUp={!visible}>
      <MaterialTableControl
        {...props}
        openDeleteDialog={openDeleteDialog}
      />
      <DeleteDialog
        open={open}
        onCancel={deleteCancel}
        onConfirm={deleteConfirm}
        onClose={deleteClose}
      />
    </Hidden>
  );
};

export const flatArrayWithDescriptionTester = rankWith(
    4,
    isPrimitiveArrayControl
);
export default withJsonFormsArrayLayoutProps(FlatArrayWithDescription);
