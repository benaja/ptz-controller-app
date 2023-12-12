# PZT Controller App

## Local developemnt

### Pre-requisites

- [Node.js](https://nodejs.org/en/) (v20)
  Use Node Version Manager (nvm) to install Node.js. On Mac you can install it by running:

MacOS:

```bash
brew install nvm
```

Linux:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

Windows:
[Download from Github](https://github.com/coreybutler/nvm-windows)

- [pnpm](https://pnpm.js.org/) (v5)
  Install pnpm by running:

```bash
npm install -g pnpm
```

### Install dependencies

Navigate to the project folder and run:

```bash
pnpm install
```

### Run the app

```bash
pnpm dev
```

This will start the app in development mode. The electron app will be opened automatically.

### mocking camers

To mock the cameras we run a websocket on virtual network interfaces, so they have different IP addresses.

First you need to create some virtual network interfaces. On Mac you can do it by running:

```bash
sudo ifconfig lo0 alias 127.0.0.2
sudo ifconfig lo0 alias 127.0.0.3
sudo ifconfig lo0 alias 127.0.0.4
```

Verify the interface:

```bash
ifconfig lo0
```

For removing the interface run:

```bash
sudo ifconfig lo0 -alias 127.0.0.2
```

Then you need to run the websockets:

```bash
pnpm mock-cameras
```
