import React, { useState } from 'react';
import {
    materialRenderers,
    materialCells,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DownloadButton from './DownloadButton';
import GithubLoginButton from './GithubLoginButton';
import GithubPushButton from './GithubPushButton';
import ObjectArrayWithDescription, {
    objectArrayWithDescriptionTester
} from './ObjectArrayWithDescription';
import FlatArrayWithDescription, {
    flatArrayWithDescriptionTester
} from './FlatArrayWithDescription';
import TextWithDescription, {
    textWithDescriptionTester
} from './TextWithDescription';
import GroupWithAccordion, {
    groupWithAccordionTester
} from './GroupWithAccordion';

const App = () => {

    const fetchDocumentation = () => {
        fetch("https://readthedocs.org/api/v3/embed/?format=json&url=https://open-sdg.readthedocs.io/en/latest/configuration/")
          .then(response => {
            return response.json()
          })
          .then(data => {
            setDocumentation(data);
          });
    }

    const setDocumentation = (data) => {
        const el = document.createElement('html');
        el.innerHTML = '<html><head><title>titleTest</title></head><body>' + data.content + '</body></html>';
        const section = el.querySelector('.section');
        let currentId = null;
        const settings = {};
        for (const child of section.children) {
            if (child.id) {
                currentId = child.id;
            }
            if (currentId) {
                if (!settings[currentId]) {
                    settings[currentId] = '';
                }
                settings[currentId] += child.outerHTML;
            }
        }
        for (const documentationKey of Object.keys(settings)) {
            const accordionEl = document.getElementById(documentationKey + '-documentation');
            if (accordionEl) {
                accordionEl.innerHTML = settings[documentationKey];
                const links = accordionEl.getElementsByTagName('a');
                for (const link of links) {
                    link.target = '_blank';
                }
            }
        }
    }

    const theme = createTheme({
        components: {
            MuiTabs: {
                defaultProps: {
                    orientation: 'vertical',
                },
            },
            MuiAppBar: {
                defaultProps: {
                    sx: {
                        width: 'inherit',
                        marginRight: '16px'
                    }
                }
            }
        },
    });

    const renderers = [
        ...materialRenderers,
        {
            tester: objectArrayWithDescriptionTester,
            renderer: ObjectArrayWithDescription,
        },
        {
            tester: flatArrayWithDescriptionTester,
            renderer: FlatArrayWithDescription,
        },
        {
            tester: textWithDescriptionTester,
            renderer: TextWithDescription,
        },
        {
            tester: groupWithAccordionTester,
            renderer: GroupWithAccordion,
        },
    ];

    const {
        schema,
        uiSchema,
        initialData,
        configFilename,
        configFolder,
        githubClientId,
        githubProxyUrl,
        githubRepo,
        githubOwner,
    } = opensdg.configForm;
    const [formData, setFormData] = useState(initialData);
    const [formErrors, setFormErrors] = useState(null);
    const jsonformsConfig = {
        showUnfocusedDescription: true,
    };
    setTimeout(fetchDocumentation, 2000);
    return (
        <>
            <DownloadButton
                formData={formData}
                formErrors={formErrors}
                filename={configFilename}
            />
            { githubClientId && githubProxyUrl &&
            <GithubLoginButton
                githubClientId={githubClientId}
                githubProxyUrl={githubProxyUrl}
            />
            }
            { githubClientId && githubProxyUrl &&
            <GithubPushButton
                formData={formData}
                formErrors={formErrors}
                filename={configFilename}
                folder={configFolder}
                githubRepo={githubRepo}
                githubOwner={githubOwner}
            />
            }
            <div style={{display: 'flex'}}>
                <ThemeProvider theme={theme}>
                    <JsonForms
                        schema={schema}
                        uischema={uiSchema}
                        data={formData}
                        renderers={renderers}
                        config={jsonformsConfig}
                        cells={materialCells}
                        onChange={({ data, errors }) => {
                            setFormData(data);
                            setFormErrors(errors);
                        }}
                    />
                </ThemeProvider>
            </div>
        </>
    )
}

export default App;
