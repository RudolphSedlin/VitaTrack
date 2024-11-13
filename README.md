# Running the client

1. From the project root directory, enter the client directory.

    ```bash
    cd mobile-app
    ```
    
2. Install dependencies

   ```bash
   npm install --force
   ```

3. Start the app

   ```bash
    npx expo start
   ```
   
4. Scan the QR code with your camera (iOS) or the Expo Go app (Android).

5. **MAYBE NECESSARY** Allow traffic over port 8081. Many firewalls forbid public traffic over this port.


# Running the API:

Assuming the API has not been deployed to a remote server like AWS EC2 and is being tested locally, you can start it with the following steps.

1. From the project root directory, enter the API directory.

    ```bash
    cd API
    ```
    
2. Install node dependencies.

    ```bash
    npm install
    ```
    
3. Install MongoDB on the host machine. See the following common distributions for instructions. Unnamed distributions are likely to be derivatives of these common ones.

    Ubuntu/Debian:
    ```bash
    sudo apt update
    sudo apt install -y mongodb
    ```
    
    RHEL/CentOS/Fedora:
    ```bash
    sudo dnf install -y mongodb
    ```

    Arch Linux:
    ```bash
    sudo pacman -S mongodb
    ```
    
    OpenSUSE:
    ```bash
    sudo zypper install -y mongodb
    ```
    
    Gentoo:
    ```bash
    sudo emerge --ask dev-db/mongodb
    ```
    
    Alpine Linux:
    ```bash
    sudo apk add mongodb
    ```
    
4. Start the MongoDB service.

    On most systems (Ubuntu, Debian, Fedora, CentOS 7+, openSUSE, Arch Linux), ***systemctl*** is reponsible for service management.
    ```bash
    sudo systemctl start mongodb
    ```
    
    On certain older systems ***service*** is responsible for service management.
    ```bash
    sudo service mongodb start
    ```
    
    Respectfully for the above system configurations, the service can be checked for operation as such:
    ```bash
    sudo systemctl status mongodb
    ```
    ```bash
    sudo service mongodb status
    ```
    
5. ***OPTIONAL*** Enable MongoDB at boot.

    Respectfully for the above system configurations.
    ```bash
    sudo systemctl enable mongodb
    ```
    ```bash
    sudo chkconfig mongodb on
    ```
    
6. Start the server.

    ```bash
    npm start
    ```
    
7. ***OPTIONAL*** Run the tester.

    ```bash
    npm run test
    ```
    
    Run the cleaner afterwards, you may need to Ctrl+C (SIGINT) to exit it after it has run.
    ```bash
    npm run clean
    ```
    
8. ***OPTIONAL*** Run the seeder.

    ```bash
    npm run seed
    ```
    As above, run the cleaner afterwards.
    
9. **MAYBE NECESSARY** Allow traffic over port 3000. Many firewalls forbid public traffic over this port.
