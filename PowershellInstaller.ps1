function Install-Dependancies {
    Write-Host "Next lets get your Discord Token" -ForegroundColor Green -BackgroundColor Black
    Write-Host "1. From either the web application, or the installed Discord app, do ""Ctrl + Shift + i""" -ForegroundColor Green -BackgroundColor Black
    Write-Host "2. This brings up the ""Developer Tools"". Go to the ""Application tab""" -ForegroundColor Green -BackgroundColor Black
    Write-Host "3. On the left, expand ""Local Storage"", then click on the discordapp.com entry (it should be the only one)." -ForegroundColor Green -BackgroundColor Black
    Write-Host "4. Locate the entry called ""token"" and copy it" -ForegroundColor Green -BackgroundColor Black
    Write-Host "5. Open this GIF to see the process: https://favna.s-ul.eu/B33EG6HK.gif" -ForegroundColor Green -BackgroundColor Black
     
    $token = Read-Host -Prompt "Please paste your token, INCLUDING the "" "" marks "
    
    Write-Host "Now your User ID" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Enable Discord developer mode by opening settings -> going to appearance -> Enabling Developer Mode" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Click your own name on any message sent by you and click ""COPY ID""" -ForegroundColor Green -BackgroundColor Black
    
    $ownerid  = Read-Host -Prompt "Please paste your OwnerID, ONLY the number!"
    
    Write-Host "Would you like to set your own global command prefix (default $)? [Y/N]" -ForegroundColor Green 
         $Readhost = Read-Host "[Y/N] " 
         Switch ($ReadHost) 
          { 
            Y {Write-Host "Queueing Visual Studio Code installation"-ForegroundColor Yellow -BackgroundColor Black; $gcpOpt=$true}
            N {Write-Host "Skipping Visual Studio Code installation"-ForegroundColor DarkRed -BackgroundColor Black; $gcpOpt=$false} 
            Default {Write-Host "Skipping Visual Studio Code installation"-ForegroundColor DarkRed -BackgroundColor Black; $gcpOpt=$false} 
          }
    
    $gcp = "$"
    
    if($gcpOpt) {
        $gcp  = Read-Host -Prompt "Please enter your global command prefix"
    }
    
    Write-Host "Setting up some dependancies. This may take a couple of minutes to more than 10 minutes depending on fast your system and download speeds are" -ForegroundColor Green -BackgroundColor Black
    
    Write-Host "Installing yarn"
    npm i -g yarn pm2
    
    Write-Host "Installing build tools"
    yarn global add windows-build-tools node-gyp node-pre-gyp
    
    Write-Host "Setting up node modules (can take a long time!)"
    yarn install
    
    Write-Host "Ensuring sqlite is properly installed"
    yarn add sqlite
    
    Write-Host "Generating auth.json file"
    $AuthDetailsToFile =
@"
    {{
        "token": {0},
        "ownerID": "{1}",
        "globalCommandPrefix": "{2}",
        "googleapikey": "AIzaSyBd_jbHu5zZwSqX3LpMLHPWUEzjNCLfs3A",
        "imageEngineKey": "008067345873846365534:rupdpapnrca",
        "searchEngineKey": "008067345873846365534:wwp8wiwzxzm",
        "oxrAppID": "722f3aff47054bc08b2405969b5d38b3",
        "TheMovieDBV3ApiKey": "acee520942a82c76336b06f4dd8c9463",
        "steamAPIKey": "B1CBEDDBB86FA6E0401063E19F244474",
        "igdbAPIKey": "135cffc683eb0b01d98685455247e1b5",
        "webhookID": "333967825842470913",
        "webhooktoken": "PsKe5JZSOBS4liG1gMtcdSapVE7ZYy1NtTKhdTNTVA4pCyt4xEqpV9HVUZTRFdNTrkWH"
    }}
"@  -f $token, $ownerid, $gcp

    $AuthDetailsToFile | Out-File -FilePath src\auth.json -Encoding UTF8
    
    Write-Host "Cleaning up" -ForegroundColor Red -BackgroundColor Black
    Write-Host "Deleting Downloads folder" -ForegroundColor Green -BackgroundColor Black
    Remove-Item -Recurse -Force -Path Downloads\
    
    Write-Host "Starting the bot using pm2" -ForegroundColor Red -BackgroundColor Black
    pm2 start .\src\app.js --name selfbot
    
    Write-Host "pm2 basic usage list:" -ForegroundColor Red -BackgroundColor Black
    Write-Host "pm2 stop 0 --> stops the bot" -ForegroundColor Green -BackgroundColor Black
    Write-Host "pm2 restart 0 --> restarts the bot" -ForegroundColor Green -BackgroundColor Black
    Write-Host "pm2 list --> shows currently running processes" -ForegroundColor Green -BackgroundColor Black
    Write-Host "pm2 info 0 --> shows detailed info about selfbot process" -ForegroundColor Green -BackgroundColor Black
    Write-Host "pm2 reset 0 --> resets error counter to 0 for bot" -ForegroundColor Green -BackgroundColor Black
    Write-Host "pm2 flush --> flushes the current logs" -ForegroundColor Green -BackgroundColor Black
    
    Write-Host "Further Resources:" -ForegroundColor Red -BackgroundColor Black
    Write-Host "GitHub Wiki: https://github.com/Favna/Discord-Self-Bot/wiki" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Join the support server: https://discord.gg/zdt5yQt" -ForegroundColor Green -BackgroundColor Black
    Write-Host "Starting the bot without pm2: yarn start" -ForegroundColor Green -BackgroundColor Black
}
function Install-Programs {
    If([Environment]::Is64BitProcess) {
        $64bit=$true
    }
    
    Write-Host "Would you like to install Notepad++ (Default is No)?" -ForegroundColor Green 
        $Readhost = Read-Host "[Y/N] " 
        Switch ($ReadHost) 
         { 
           Y {Write-Host "Queueing Notepad++ installation"-ForegroundColor Yellow -BackgroundColor Black; $NppOpt=$true} 
           N {Write-Host "Skipping Notepad++ installation"-ForegroundColor DarkRed -BackgroundColor Black; $NppOpt=$false} 
           Default {Write-Host "Skipping Notepad++ installation"-ForegroundColor DarkRed -BackgroundColor Black; $NppOpt=$false} 
         }
    
    Write-Host "Would you like to install Visual Studio Code (Default is No)?" -ForegroundColor Green 
         $Readhost = Read-Host "[Y/N] " 
         Switch ($ReadHost) 
          { 
            Y {Write-Host "Queueing Visual Studio Code installation"-ForegroundColor Yellow -BackgroundColor Black; $CodeOpt=$true}
            N {Write-Host "Skipping Visual Studio Code installation"-ForegroundColor DarkRed -BackgroundColor Black; $CodeOpt=$false} 
            Default {Write-Host "Skipping Visual Studio Code installation"-ForegroundColor DarkRed -BackgroundColor Black; $CodeOpt=$false} 
          }
    
    New-Item -ItemType directory -Path Downloads\
    
    Write-Host "Downloading and installing dependancies" -ForegroundColor Cyan -BackgroundColor Black
          
    If($64bit) {
        Write-Host "Downloading NodeJS" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi" -OutFile "Downloads/nodejsInstaller-x64.msi"
        Write-Host "Downloading Git" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://github.com/git-for-windows/git/releases/download/v2.16.1.windows.2/Git-2.16.1.2-64-bit.exe" -OutFile "Downloads/GitInstaller-x64.exe"
        Write-Host "Downloading Python" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://www.python.org/ftp/python/3.6.2/python-3.6.2-amd64.exe" -OutFile "Downloads/PythonInstaller-x64.exe"
    
        Write-Host "About to install NodeJS. Make sure you select the option ""Add to PATH"" while installing!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process msiexec.exe -Wait -ArgumentList "/I Downloads/nodejsInstaller-x64.msi"
        Write-Host "NodeJS Installed"  -ForegroundColor Cyan -BackgroundColor Black
    
        Write-Host "About to start installing Git. Make sure you select ""Run Git from Windows Command Prompt"" and ""Use Windows' default console view"" when these options are asked by the installer!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/GitInstaller-x64.exe" -Wait
        Write-Host "Git Installed" -ForegroundColor Cyan -BackgroundColor Black
    
        Write-Host "About to start installing Python. Make sure to select the option ""Add Python 3.6 to PATH"" at the very beginning of the installer!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/PythonInstaller-x64.exe" -Wait
        Write-Host "Python Installed"  -ForegroundColor Cyan -BackgroundColor Black
    
        if($NppOpt) {
            Write-Host "Downloading Notepad++" -ForegroundColor Cyan -BackgroundColor Black
            Invoke-WebRequest "https://notepad-plus-plus.org/repository/7.x/7.5.4/npp.7.5.4.Installer.x64.exe" -OutFile "Downloads/Npp-x64.exe"
            Write-Host "About to start installing Notepad++" -ForegroundColor Cyan -BackgroundColor Black
            Start-Process "Downloads/Npp-x64.exe" -Wait
        }
    
        if($CodeOpt) {
            Write-Host "Downloading Visual Studio Code" -ForegroundColor Cyan -BackgroundColor Black
            Invoke-WebRequest "https://go.microsoft.com/fwlink/?Linkid=852157" -OutFile "Downloads/Code-x64.exe"
            Write-Host "About to start installing Visual Studio Code" -ForegroundColor Cyan -BackgroundColor Black
            Start-Process "Downloads/Code-x64.exe" -Wait
        }
    
    } else {
        Write-Host "Downloading NodeJS" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://nodejs.org/dist/v8.9.4/node-v8.9.4-x86.msi" -OutFile "Downloads/nodejsInstaller-x32.msi"
        Write-Host "Downloading Git" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://github.com/git-for-windows/git/releases/download/v2.16.1.windows.2/Git-2.16.1.2-32-bit.exe" -OutFile "Downloads/GitInstaller-x32.exe"
        Write-Host "Downloading Python" -ForegroundColor Cyan -BackgroundColor Black
        Invoke-WebRequest "https://www.python.org/ftp/python/3.6.2/python-3.6.2.exe" -OutFile "Downloads/PythonInstaller-x32.exe"
    
        Write-Host "About to install NodeJS. Make sure you select the option ""Add to PATH"" while installing!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process msiexec.exe -Wait -ArgumentList "/I Downloads/nodejsInstaller-x32.msi"
        Write-Host "NodeJS Installed" -ForegroundColor Cyan -BackgroundColor Black
    
        Write-Host "About to start installing Git. Make sure you select ""Run Git from Windows Command Prompt"" and ""Use Windows' default console view"" when these options are asked by the installer!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/GitInstaller-x32.exe" -Wait
        Write-Host "Git Installed" -ForegroundColor Cyan -BackgroundColor Black
    
        Write-Host "About to start installing Python. Make sure to select the option ""Add Python 3.6 to PATH"" at the very beginning of the installer!!" -ForegroundColor Cyan -BackgroundColor Black
        Start-Process "Downloads/PythonInstaller-x32.exe" -Wait
        Write-Host "Python Installed"  -ForegroundColor Cyan -BackgroundColor Black
    
        if($NppOpt) {
            Write-Host "Downloading Notepad++" -ForegroundColor Cyan -BackgroundColor Black
            Invoke-WebRequest "https://notepad-plus-plus.org/repository/7.x/7.5.4/npp.7.5.4.Installer.exe" -OutFile "Downloads/Npp-x32.exe"
            Write-Host "About to start installing Notepad++" -ForegroundColor Cyan -BackgroundColor Black
            Start-Process "Downloads/Npp-x32.exe" -Wait
        }
    
        if($CodeOpt) {
            Write-Host "Downloading Visual Studio Code" -ForegroundColor Cyan -BackgroundColor Black
            Invoke-WebRequest "https://go.microsoft.com/fwlink/?LinkID=623230" -OutFile "Downloads/Code-x32.exe"
            Write-Host "About to start installing Visual Studio Code" -ForegroundColor Cyan -BackgroundColor Black
            Start-Process "Downloads/Code-x32.exe" -Wait
        }
    }

    Install-Dependancies
}

If (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
    [Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Warning "You need to run this script as administrator!`nPlease re-run this script as an Administrator!"
    pause
    break
}

Write-Host "After the installers it could be that you have to relaunch the powershell (or even reboot!)
in order to reload the windows PATH environment variable.
Whether you actually have to depends on your windows installation as for some it is required but for others it is not.
You'll notice whether you need to actually relaunc/reboot when the script fails to find yarn and/or pm2.
Is this the second time running the script (default is no)?" -ForegroundColor Green

    $Readhost = Read-Host "[Y/N] " 
    Switch ($ReadHost) 
     { 
       Y {Write-Host "Skipping to after installers"-ForegroundColor Yellow -BackgroundColor Black; $instOpt=$true} 
       N {Write-Host "Going to the installers"-ForegroundColor Yellow -BackgroundColor Black; $instOpt=$false} 
       Default {Write-Host "Going to the installers"-ForegroundColor Yellow -BackgroundColor Black; $instOpt=$false} 
     }

if($instOpt) {
    Install-Dependancies
} else {
    Install-Programs
}