# Azure IoT 

# Install

### Operating System

Any one of the below operating system with 64 bit Machine, 64 bit Operating System required.

|OS   | Name | 
|-----|------|
|Windows   | Windows 8.1 onwards   |
|Linux   | Fedora/Mint/Ubuntu GUI  |
|Mac   | Mac 10 onwards   |

### Software Setup

1. Install Node.js 10.x LTS 64 bit from https://nodejs.org/en/download/
2. Install Python 3.x from https://www.python.org/downloads/
3. Install Azure Cli from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
4. Install  Azure IoT Extension

After installing Azure cli, open Command Prompt/Terminal,

```
az extension add --name azure-cli-iot-ext
```

5. Install Google Chrome or Firefox or Safari Latest Edge Browser for accessing Azure Web Portal

### Development Environment

Azure Supports many programming environments for the application development.
This workshop shall focus on Node.js [JavaScript] as the development environment, as JavaScript is a simple language, easy to write and execute the source code.

1. Visual Studio Code 64 bit from https://code.visualstudio.com/download

### Azure Account

1. Participant to sign-up with Azure Portal. Talk to Employer or Event Organizer for Azure Pass or Credit if participant doesn't want to use personal credit card for sign-up.

2. For sign-up https://azure.microsoft.com/en-in/free/

3. Azure pass activation https://www.microsoftazurepass.com/

### Remember

1. Remember to remove consumption based chargable services if you don't use it

### Pre-Requisites

1. Knowledge of Basic JavaScript
2. JavaScript Callback, basic of Await/Async method
3. Knowledge on setting up user/system wise environment variables for the operating system
4. Basics of Distributed systems


### Use Azure cli to Login

Open a command prompt

```
az login
```


not now, if you want to logout

```
az logout
```
