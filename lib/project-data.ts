///<reference path=".d.ts"/>
"use strict";

import constants = require("./constants");
import path = require("path");
import os = require("os");

export class ProjectData implements IProjectData {
	private static OLD_PROJECT_FILE_NAME = ".tnsproject";

	public projectDir: string;
	public platformsDir: string;
	public projectFilePath: string;
	public projectId: string;
	public projectName: string;

	constructor(private $fs: IFileSystem,
		private $errors: IErrors,
		private $logger: ILogger,
		private $projectHelper: IProjectHelper,
		private $staticConfig: IStaticConfig,
		private $options: IOptions) {
		this.initializeProjectData().wait();
	}

	private initializeProjectData(): IFuture<void> {
		return(() => {
			let projectDir = this.$projectHelper.projectDir;
			// If no project found, projectDir should be null
			if(projectDir) {
				this.initializeProjectDataCore(projectDir);
				let data: any = null;

				if (this.$fs.exists(this.projectFilePath).wait()) {
					try {
						let fileContent = this.$fs.readJson(this.projectFilePath).wait();
						data = fileContent[this.$staticConfig.CLIENT_NAME_KEY_IN_PROJECT_FILE];
					} catch (err) {
						this.$errors.fail({formatStr: "The project file %s is corrupted." + os.EOL +
							"Consider restoring an earlier version from your source control or backup." + os.EOL +
							"Additional technical info: %s",
								suppressCommandHelp: true},
							this.projectFilePath, err.toString());
					}

					if(data) {
						this.projectId = data.id;
					} else { // This is the case when we have package.json file but nativescipt key is not presented in it
						this.tryToUpgradeProject().wait();
					}
				} 
			} else { // This is the case when no project file found
				this.tryToUpgradeProject().wait();
			}
		}).future<void>()();
	}

	private throwNoProjectFoundError(): void {
		this.$errors.fail("No project found at or above '%s' and neither was a --path specified.", this.$options.path || path.resolve("."));
	}

	private tryToUpgradeProject(): IFuture<void> {
		return (() => {
			let projectDir = this.projectDir || path.resolve(this.$options.path || ".");
			let oldProjectFilePath = path.join(projectDir, ProjectData.OLD_PROJECT_FILE_NAME);
			if(this.$fs.exists(oldProjectFilePath).wait()) {
				this.upgrade(projectDir, oldProjectFilePath).wait();
			} else {
				this.throwNoProjectFoundError();
			}
		}).future<void>()();
	}

	private upgrade(projectDir: string, oldProjectFilePath: string): IFuture<void> {
		return (() => {
			try {
				let oldProjectData = this.$fs.readJson(oldProjectFilePath).wait();

				let newProjectFilePath = this.projectFilePath || path.join(projectDir, this.$staticConfig.PROJECT_FILE_NAME);
				let newProjectData = this.$fs.exists(newProjectFilePath).wait() ? this.$fs.readJson(newProjectFilePath).wait() : {};
				newProjectData[this.$staticConfig.CLIENT_NAME_KEY_IN_PROJECT_FILE] = oldProjectData;
				this.$fs.writeJson(newProjectFilePath, newProjectData).wait();

				this.$fs.deleteFile(oldProjectFilePath).wait();
			} catch(err) {
				this.$logger.out("An error occurred while upgrading your project.");
				throw err;
			}

			this.initializeProjectDataCore(projectDir);

			this.$logger.out("Successfully upgraded your project file.");
		}).future<void>()();
	}

	private initializeProjectDataCore(projectDir: string): void {
		this.projectDir = projectDir;
		this.projectName = this.$projectHelper.sanitizeName(path.basename(projectDir));
		this.platformsDir = path.join(projectDir, "platforms");
		this.projectFilePath = path.join(projectDir, this.$staticConfig.PROJECT_FILE_NAME);
	}
}
$injector.register("projectData", ProjectData);