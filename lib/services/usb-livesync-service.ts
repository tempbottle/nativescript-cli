///<reference path="../.d.ts"/>
"use strict";

import usbLivesyncServiceBaseLib = require("../common/services/usb-livesync-service-base");
import AppIdentifier = require("../common/mobile/app-identifier");

import path = require("path");
import minimatch = require("minimatch");

export class UsbLiveSyncService extends usbLivesyncServiceBaseLib.UsbLiveSyncServiceBase implements IUsbLiveSyncService {
	private excludedProjectDirsAndFiles = [
		"app_resources"
	];
	
	constructor(private $commandsService: ICommandsService,
		$devicesServices: Mobile.IDevicesServices,
		private $fs: IFileSystem,
		$mobileHelper: Mobile.IMobileHelper,
		private $options: IOptions,
		private $platformsData: IPlatformsData,
		private $projectData: IProjectData) {
			super($devicesServices, $mobileHelper); 
	}
	
	public liveSync(platform: string): IFuture<void> {
		return (() => {
			this.$devicesServices.initialize({ platform: platform, deviceId: this.$options.device }).wait();
			platform = this.$devicesServices.platform;
			
			// TODO: Add validation
			
			// TODO: create use appIdentifier factory with constructor injection and replace false with companion option
			let appIdentifier = AppIdentifier.createAppIdentifier(platform, this.$projectData.projectId, false);
			let projectDir = path.join(this.$projectData.projectDir, "app");
			let projectFiles = this.$fs.enumerateFilesInDirectorySync(projectDir, (filePath, stat) => !this.isFileExcluded(path.relative(projectDir, filePath), this.excludedProjectDirsAndFiles, projectDir));
			this.sync(appIdentifier, projectDir, projectFiles).wait();
			
			this.$commandsService.tryExecuteCommand("device", ["run", this.$projectData.projectId]).wait();
		
		}).future<void>()();
	}
	
	private isFileExcluded(path: string, exclusionList: string[], projectDir: string): boolean {
		return !!_.find(exclusionList, (pattern) => minimatch(path, pattern, { nocase: true }));
	}
}
$injector.register("usbLiveSyncService", UsbLiveSyncService);
