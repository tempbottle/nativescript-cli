///<reference path="../.d.ts"/>
"use strict";

import Future = require("fibers/future");

export class RunCommandBase {
	constructor(private $platformService: IPlatformService) { }
	
	public allowedParameters: ICommandParameter[] = [];
	public canExecute(args: string[]): IFuture<boolean> {
		return Future.fromResult(true);
	}

	public execute(args: string[]): IFuture<void> {
		return this.$platformService.runPlatforms(args);
	}
}
$injector.registerCommand("run|*default", RunCommandBase);

export class RunIosCommand extends RunCommandBase {
	constructor($platformService: IPlatformService,
		private $platformsData: IPlatformsData) {
		super($platformService);
	}

	public allowedParameters: ICommandParameter[] = [];

	public execute(args: string[]): IFuture<void> {
		return super.execute([this.$platformsData.availablePlatforms.iOS]);
	}
}
$injector.registerCommand("run|ios", RunIosCommand);

export class RunAndroidCommand extends RunCommandBase {
	constructor($platformService: IPlatformService,
		private $platformsData: IPlatformsData) {
		super($platformService);
	}

	public allowedParameters: ICommandParameter[] = [];

	public execute(args: string[]): IFuture<void> {
		return super.execute([this.$platformsData.availablePlatforms.Android]);
	}
}
$injector.registerCommand("run|android", RunAndroidCommand);
