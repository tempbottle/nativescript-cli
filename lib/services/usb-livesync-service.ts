///<reference path="../.d.ts"/>
"use strict";

import usbLivesyncServiceBaseLib = require("../common/services/usb-livesync-service-base");
import path = require("path");

export class UsbLiveSyncService extends usbLivesyncServiceBaseLib.UsbLiveSyncServiceBase implements IUsbLiveSyncService {
	private excludedProjectDirsAndFiles = [
		"app_resources"
	];
	
	constructor(private $commandsService: ICommandsService,
		$devicesServices: Mobile.IDevicesServices,
		$fs: IFileSystem,
		$mobileHelper: Mobile.IMobileHelper,
		$localToDevicePathDataFactory: Mobile.ILocalToDevicePathDataFactory,
		$options: IOptions,
		private $platformsData: IPlatformsData,
		private $projectData: IProjectData,
		$deviceAppDataFactory: Mobile.IDeviceAppDataFactory,
		$logger: ILogger,
		private $injector: IInjector) {
			super($devicesServices, $mobileHelper, $localToDevicePathDataFactory, $logger, $options, $deviceAppDataFactory, $fs); 
	}
	
	public liveSync(platform: string): IFuture<void> {
		return (() => {
			
			// TODO: Add validation
			
			// TODO: Consider to move usbLiveSyncService to platformData
			
			let restartAppOnDeviceAction = (device: Mobile.IDevice, deviceAppData: Mobile.IDeviceAppData): IFuture<void> => {
				let platformSpecificUsbLiveSyncService: any = null;
				if(platform.toLowerCase() === "android") {
					platformSpecificUsbLiveSyncService = this.$injector.resolve(AndroidLiveSyncService, {device: device});
				} else if(platform.toLowerCase() === "ios") {
					platformSpecificUsbLiveSyncService = this.$injector.resolve(IOSUsbLiveSyncService, {device: device});
				}
				
				return platformSpecificUsbLiveSyncService.restartApplication(deviceAppData);
			}
			
			this.sync(platform, this.$projectData.projectId, this.$projectData.projectDir, path.join(this.$projectData.projectDir, "app"), this.excludedProjectDirsAndFiles, restartAppOnDeviceAction).wait();			
			
			//this.$commandsService.tryExecuteCommand("device", ["run", this.$projectData.projectId]).wait();
		
		}).future<void>()();
	}
}
$injector.register("usbLiveSyncService", UsbLiveSyncService);

export class IOSUsbLiveSyncService{
	constructor(device: Mobile.IDevice) { }
	
	/* public restartApplication(): IFuture<void> {
		
	} */
}

export class AndroidLiveSyncService {
	constructor(private device: Mobile.IDevice) { }
	
	public restartApplication(deviceAppData: Mobile.IDeviceAppData): IFuture<void> {
		return (() => {
			let	commands = [
				"SyncFiles \r"
			];
			(<any>this.device).createLiveSyncCommandsFileOnDevice(deviceAppData.deviceProjectRootPath, commands).wait();
			//(<any>this.device).sendBroadcastToDevice("com.telerik.LiveSync", { "app-id": deviceAppData.appIdentifier }).wait(); 
			
			//this.device.stopApplication(deviceAppData.appIdentifier).wait();			
			//this.device.runApplication(deviceAppData.appIdentifier).wait();
		}).future<void>()();
	}
}
