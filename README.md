This is an action to publish templates to Nosto.

### Prerequisites
In order to use this action a Nosto token is needed for authentication

### Adding secret token
Get the [settings token](https://help.nosto.com/en/articles/613616-settings-authentication-tokens) from Nosto dashboard.

Store the token in GitHub by following these steps: 

1. Navigate to `Settings` > `Secrets` and click `Add a new secret`.

2. Paste in your token and click on `Add secret`

### Implementation
Create a new `yml` file under `.github/workspaces`

Add the following lines

```yaml
name: Publish templates to Nosto

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1 
    - uses: nosto/action-experiences@master
      with:
        nosto-token: ${{ secrets.YOUR_TOKEN_NAME }}
        template-directory: TEMPLATE_PATH
```

Two inputs are required by the action

1. `nosto-token` which is the token you just saved
2. `template-directory` which is the path to the templates directory


#### Example
An example of the workflow can be found in:

https://github.com/olsi-qose/velocity-templates
