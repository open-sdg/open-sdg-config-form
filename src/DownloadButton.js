import React from 'react';
import { saveAs } from 'file-saver';
import { dump } from 'js-yaml';
import { Button } from '@mui/material';

const DownloadButton = (props) => {
    const { formData, formErrors, filename } = props;
    const saveAsFile = (t,f,m) => {
        try {
          var b = new Blob([t],{type:m});
          saveAs(b, f);
        } catch (e) {
          window.open("data:"+m+"," + encodeURIComponent(t), '_blank','');
        }
    }
    const clickHandler = (e) => {
        if (formErrors.length > 0) {
            const errorMessages = formErrors.map((error) => '- ' + error.parentSchema.title + ': ' + error.message);
            let message = 'Please correct the following errors: \n';
            alert(message + errorMessages.join('\n'));
        }
        else {
            const yaml = dump(formData);
            saveAsFile(yaml, filename, 'text/plain;charset=utf-8');
        }
    }
    return (
        <Button sx={{ mt:2, mb:2, mr: 2 }} variant="contained" onClick={clickHandler}>
            Download configuration
        </Button>
    )
}

export default DownloadButton;
