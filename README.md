# Web-API AdminPanel

The admin panel provides an access point for server admins and moderators to easily manage their 
server without having to be online/in minceraft or connected to the server through ssh.


## Table of Contents
1. [Setup](#setup)
	1. [Integrated setup](#integrated)
	1. [External setup](#external)
1. [Creating users](#creating-users)
1. [Modifying users](#modifying-users)


<a name="setup"></a>
## Setup
There are two different ways you can set up the AdminPanel.
1. [Integrated setup](#integrated)  
    The AdminPanel is already built into the Web-API plugin, so it can run directly 
    from your minecraft server (**recommended for most cases**)

1. [External setup](#external)  
    The AdminPanel can be run on an external webserver, which allows it to connect to 
    multiple minecraft servers

<a name="integrated"></a>
### 1. Integrated setup
1. Add the Web-API plugin to the mods folder of your server
1. (Re)start your server to load Web-API

Now depending on where your minecraft server is running you will have to take different steps

#### If your minecraft server is running *on your own computer/desktop/laptop:*
1. You can access the internet page http://localhost:8080 or https://localhost:8081 to access 
the admin panel. Please remember that this will **only work on the computer you are running 
the minecraft server from**

#### If your minecraft server is running *on another computer or server:*
1. You will have to edit the config file `webapi/config.conf` and set `host="0.0.0.0"`, 
this will make it so that you can connect to the AdminPanel from other computers aswell.
1. Reload the webapi plugin using `sponge plugins reload`, or restart your minecraft server
1. You should now be able to access the AdminPanel on your server, to do this you need to 
know the IP/URL of your server. 
    
    For example, if your server is running at `88.88.88.88` then you will have to open the web page:
    http://88.88.88.88:8080.
    
    If your server has a domain name, for example `my.mc-server.com`, then you can use that: 
    http://my.mc-server.com:8080


<a name="external"></a>
### 2. External setup
The external setup is a bit more involved and only recommended if you have multiple minecraft
servers that you would like to manage with the same AdminPanel, or if you want to use an
external webserver to host the AdminPanel.

1. Install the Web-API plugin on all the servers that you wish to connect to the AdminPanel.

1. In the config file located at `/config/webapi/config.conf` set `adminPanel=false` for
each of those servers. This makes it so that each of the servers don't host their own
AdminPanel.

1. Download the AdminPanel zip file [from the Github repo](https://github.com/Valandur/admin-panel/releases),
or clone the repository and run `npm run build` to build it.

1. Extract the zip file in the location where you wish to host the AdminPanel.  
    For example if you're using an apache webserver you'll want to drop this into
    the `httpdocs` or `/var/www` directory. You can also use node, nginx or any other 
    webserver to server the files **statically**.

1. Edit the `config.json` file located in the folder where you just extracted the files.  
   You'll want to add an entry for each server that you want to manage, for example:
   ```javascript
    window.config = {
        "servers": [
            {
                "name": "Server 1",
                "apiUrl": "https://server1.my-mc-servers.com:8081",
            },
            {
                "name": "Server 2",
                "apiUrl": "http://localhost:8080"
            }
        ]
    }
    ```
    This config would add two servers to the AdminPanel. The `apiUrl` is the URL used
    to reach the Web-API running on the corresponding server.

1. Access the AdminPanel through your webserver, and you should see a dropdown where
you can pick which server you wish to connect to.


<a name="creating-users"></a>
## Creating users

To create a new user for the admin panel enter `/webapi users add [name]` in your server console.
This will create a new user with the `[name]` specified and a random password. The password will 
be shown in the server console. If you want to specify the password for the user you can use the
command `/webapi users add [name] [password]`.

> The permission required to create new users in Web-API is `webapi.users.add`


<a name="modifying-users"></a>
## Modifying users (changing passwords, etc.)

To change the password use the `/webapi users pw [name] [newpassword]` command.  
Remove a user by using `/webapi users remove [name]`.  
To change the permissions for a user you need to edit the `/config/webapi/user.conf` config file.
