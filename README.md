# PZT Controller App

## Local developemnt

### testing camers

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
