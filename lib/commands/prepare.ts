///<reference path="../.d.ts"/>
"use strict";
import Future = require("fibers/future");

export class PrepareCommand implements ICommand {
	constructor(private $platformService: IPlatformService,
		private $platformCommandParameter: ICommandParameter) { }

	execute(args: string[]): IFuture<void> {
		return (() => {
			this.$platformService.preparePlatforms(args).wait();
		}).future<void>()();
	}
public canExecute(args: string[]): IFuture<boolean> {
		return Future.fromResult(true);
	}
	allowedParameters = [this.$platformCommandParameter];
}
$injector.registerCommand("prepare", PrepareCommand);
