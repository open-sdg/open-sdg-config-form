/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import React, { useCallback, useState } from 'react';
import { ArrayLayoutProps, rankWith, isObjectArrayControl } from '@jsonforms/core';
import { withJsonFormsArrayLayoutProps } from '@jsonforms/react';
import { Hidden } from '@mui/material';
import { MaterialTableControl } from './duplicates/MaterialTableControl';
import { DeleteDialog } from './duplicates/DeleteDialog';

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
  console.log(props, 'props in ObjectArrayWithDescription');
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
    4,
    isObjectArrayControl
);
export default withJsonFormsArrayLayoutProps(ObjectArrayWithDescription);
