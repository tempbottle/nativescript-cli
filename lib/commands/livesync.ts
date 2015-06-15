///<reference path="../.d.ts"/>
"use strict";

export class UsbLivesyncCommand implements ICommand {
	constructor(private $usbLiveSyncService: IUsbLiveSyncService) { }

	execute(args: string[]): IFuture<void> {
		return this.$usbLiveSyncService.liveSync("iOS");
	}
	
	allowedParameters: ICommandParameter[] = [];
}
$injector.registerCommand("livesync", UsbLivesyncCommand);