run
==========

Usage | Synopsis
---|---
<% if((isConsole && isMacOS) || isHtml) { %>General | `$ tns run <Platform>`<% } %><% if(isConsole && (isLinux || isWindows)) { %>General | `$ tns run android`<% } %>

Runs your project on a connected device or in the native emulator for the selected platform.<% if(isMacOS) { %>You must specify the target platform on which you want to run your project.<% } %><% if(isConsole && (isLinux || isWindows)) { %>You must run `$ tns run android`<% } %>

<% if((isConsole && isMacOS) || isHtml) { %>### Attributes
`<Platform>` is the target mobile platform on which you want to run your project. You can set the following target platforms.
* `android` - Runs your project on a connected Android device, in the native emulator or in Genymotion.
* `ios` - Runs your project on a connected iOS device or in the iOS Simulator.<% } %> 

<% if(isHtml) { %> 
### Command Limitations

* You can run `$ tns run ios` only on OS X systems.

### Related Commands

Command | Description
----------|----------
[build android](build-android.html) | Builds the project for Android and produces an APK that you can manually deploy on device or in the native emulator.
[build ios](build-ios.html) | Builds the project for iOS and produces an APP or IPA that you can manually deploy in the iOS Simulator or on device, respectively.
[build](build.html) | Builds the project for the selected target platform and produces an application package that you can manually deploy on device or in the native emulator.
[debug android](debug-android.html) | Debugs your project on a connected Android device or in a native emulator.
[debug ios](debug-ios.html) | Debugs your project on a connected iOS device or in a native emulator.
[debug](debug.html) | Debugs your project on a connected device or in a native emulator.
[deploy](deploy.html) | Builds and deploys the project to a connected physical or virtual device.
[emulate android](emulate-android.html) | Builds the specified project and runs it in a native Android emulator.
[emulate ios](emulate-ios.html) | Builds the specified project and runs it in the native iOS Simulator.
[emulate](emulate.html) | You must run the emulate command with a related command.
[run android](run-android.html) | Runs your project on a connected Android device or in a native Android emulator, if configured.
[run ios](run-ios.html) | Runs your project on a connected iOS device or in the iOS Simulator, if configured.
<% } %>