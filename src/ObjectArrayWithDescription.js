import React, { useCallback, useState } from 'react';
import { ArrayLayoutProps, rankWith, isObjectArrayControl } from '@jsonforms/core';
import { withJsonFormsArrayLayoutProps } from '@jsonforms/react';
import { Hidden } from '@mui/material';
import { DeleteDialog, MaterialTableControl } from '@jsonforms/material-renderers';

export const ObjectArrayWithDescription = (props) => {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState(undefined);
  const [rowData, setRowData] = useState(undefined);
  const { removeItems, visible, description, config, uischema, schema } = props;

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

export const objectArrayWithDescriptionTester = rankWith(
    5,
    isObjectArrayControl
);
export default withJsonFormsArrayLayoutProps(ObjectArrayWithDescription);
