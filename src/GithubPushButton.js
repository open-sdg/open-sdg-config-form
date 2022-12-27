import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField,
} from '@mui/material';
import { Octokit} from '@octokit/rest';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { dump } from 'js-yaml';

const MyOctokit = Octokit.plugin(createPullRequest);

const GithubPushButton = (props) => {

    const {
        data,
        errors,
        filename,
        githubRepo,
        githubOwner,
    } = props;

    const [autoBranch, setAutoBranch] = useState(true);
    const [dialogDescription, setDialogDescription] = useState('');
    const [dialogBranchName, setDialogBranchName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogClickOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogPush = () => {
        if (!dialogDescription) {
            alert('Please enter a description of this change.');
            return;
        }
        if (!autoBranch && !dialogBranchName) {
            alert('Please enter a branch name.');
            return;
        }
        const invalidBranchName = /[^0-9a-zA-Z\-\/]+/.test(dialogBranchName);
        if (!autoBranch && invalidBranchName) {
            alert('Please remove special characters from the branch name.');
            return;
        }
        const branch = (autoBranch) ? descriptionToBranchName(dialogDescription) : dialogBranchName;
        pushToGithub(branch, dialogDescription);
    };

    const handleBranchNameChange = (e) => {
        setDialogBranchName(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        setDialogDescription(e.target.value);
    }

    const handleBranchEditClick = () => {
        setAutoBranch(false);
    }

    const descriptionToBranchName = (description) => {
        return description.toLowerCase().replace(/[^0-9a-zA-Z]+/, '-');
    }

    async function pushToGithub(branch, description) {

        if (!localStorage.getItem('accessToken')) {
            alert('First click "Login with Github".');
            setDialogOpen(false);
            return;
        }

        if (errors.length > 0) {
            const errorMessages = errors.map((error) => '- ' + error.message);
            let message = 'Please correct the following errors: \n';
            alert(message + errorMessages.join('\n'));
            setDialogOpen(false);
            return;
        }
        const octokit = new MyOctokit({
            auth: localStorage.getItem('accessToken'),
        });
        const fileChange = {
            files: {},
            commit: 'My commit message',
        };
        fileChange.files[filename] = dump(data);
        const { data: pullRequest } = await octokit.createPullRequest({
          owner: githubOwner,
          repo: githubRepo,
          title: description,
          body: '',
          head: branch,
          changes: [fileChange],
          update: true,
        });
        alert('Pull request created.');
        setDialogOpen(false);
    }

    return (
        <>
        <Button variant="contained" onClick={handleDialogClickOpen}>
            Push to Github
        </Button>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Push to Github</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Please enter a short description of this change.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="branchDescription"
                label="Description"
                fullWidth
                variant="standard"
                onKeyUp={handleDescriptionChange}
            />
            { autoBranch &&
            <Button sx={{ mt: 1, mb: 1 }} variant="contained" onClick={handleBranchEditClick}>
                Edit branch name
            </Button>
            }
            { !autoBranch &&
            <TextField
                margin="dense"
                id="branchName"
                label="Branch name"
                fullWidth
                variant="standard"
                onKeyUp={handleBranchNameChange}
            />
            }
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogPush}>Push</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default GithubPushButton;
