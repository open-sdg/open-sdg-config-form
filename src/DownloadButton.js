import React from 'react';
import { saveAs } from 'file-saver';
import { dump } from 'js-yaml';

const DownloadButton = (props) => {
    const saveAsFile = (t,f,m) => {
        try {
          var b = new Blob([t],{type:m});
          saveAs(b, f);
        } catch (e) {
          window.open("data:"+m+"," + encodeURIComponent(t), '_blank','');
        }
    }
    const clickHandler = (e) => {
        if (props.errors.length > 0) {
            const errorMessages = errors.map((error) => '- ' + error.message);
            let message = 'Please correct the following errors: \n';
            alert(message + errorMessages.join('\n'));
        }
        else {
            const yaml = dump(props.data);
            saveAsFile(yaml, props.filename, 'text/plain;charset=utf-8');
        }
    }
    const { data, errors } = props;
    return (
        <button onClick={clickHandler}>Download configuration</button>
    )
}

export default DownloadButton;
