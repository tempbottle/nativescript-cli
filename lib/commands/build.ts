///<reference path="../.d.ts"/>
"use strict";

export class BuildCommandBase implements ICommand {
	constructor(private $platformService: IPlatformService) { }
	public allowedParameters: ICommandParameter[] = [];

	execute(args: string[]): IFuture<void> {
		// TODO: validate the arguments
		return this.$platformService.buildPlatforms(args);
	}
}
$injector.registerCommand("build|*default", BuildCommandBase);

export class BuildIosCommand extends BuildCommandBase {
	constructor($platformService: IPlatformService,
		private $platformsData: IPlatformsData) {
		super($platformService);
	}

	public allowedParameters: ICommandParameter[] = [];

	public execute(args: string[]): IFuture<void> {
		return super.execute([this.$platformsData.availablePlatforms.iOS]);
	}
}
$injector.registerCommand("build|ios", BuildIosCommand);


export class BuildAndroidCommand extends BuildCommandBase {
	constructor($platformService: IPlatformService,
				private $platformsData: IPlatformsData) {
		super($platformService);
	}

	public allowedParameters: ICommandParameter[] = [];

	public execute(args: string[]): IFuture<void> {
		return super.execute([this.$platformsData.availablePlatforms.Android]);
	}
}
$injector.registerCommand("build|android", BuildAndroidCommand);
