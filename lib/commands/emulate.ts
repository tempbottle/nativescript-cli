///<reference path="../.d.ts"/>
"use strict";
import Future = require("fibers/future");

export class EmulateCommandBase implements ICommand {
	constructor(private $platformService: IPlatformService) { }
	
	public allowedParameters: ICommandParameter[] = [];
	public canExecute(args: string[]): IFuture<boolean> {
		return Future.fromResult(true);
	}

	execute(args: string[]): IFuture<void> {
		return this.$platformService.deployOnEmulators(args);
	}
}
$injector.registerCommand("emulate|*default", EmulateCommandBase);

export class EmulateIosCommand extends  EmulateCommandBase{
	constructor($platformService: IPlatformService,
		private $platformsData: IPlatformsData) {
		super($platformService);
	}

	public allowedParameters: ICommandParameter[] = [];

	public execute(args: string[]): IFuture<void> {
		return super.execute([this.$platformsData.availablePlatforms.iOS]);
	}
}
$injector.registerCommand("emulate|ios", EmulateIosCommand);

export class EmulateAndroidCommand extends EmulateCommandBase{
	constructor($platformService: IPlatformService,
		private $platformsData: IPlatformsData) {
		super($platformService);
	}

	public allowedParameters: ICommandParameter[] = [];

	public execute(args: string[]): IFuture<void> {
		return super.execute([this.$platformsData.availablePlatforms.Android]);
	}
}
$injector.registerCommand("emulate|android", EmulateAndroidCommand);
