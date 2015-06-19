///<reference path="../.d.ts"/>
"use strict";

export class UsbLivesyncCommand implements ICommand {
	constructor(private $usbLiveSyncService: IUsbLiveSyncService) { }

	execute(args: string[]): IFuture<void> {
		return this.$usbLiveSyncService.liveSync(args[0]);
	}
	
	canExecute(args: string[]): IFuture<boolean> {
		return (() => {
			return true;
		}).future<boolean>()();
	}
	
	allowedParameters: ICommandParameter[] = [];
}
$injector.registerCommand("livesync", UsbLivesyncCommand);