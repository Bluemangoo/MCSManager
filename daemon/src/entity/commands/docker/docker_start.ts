import fs from "fs-extra";
import { $t } from "../../../i18n";
import {
  DockerProcessAdapter,
  SetupDockerContainer,
  StartupDockerProcessError
} from "../../../service/docker_process_service";
import logger from "../../../service/log";
import Instance from "../../instance/instance";
import AbsStartCommand from "../start";

export default class DockerStartCommand extends AbsStartCommand {
  protected async createProcess(instance: Instance) {
    if (!instance.hasCwdPath() || !instance.config.ie || !instance.config.oe)
      throw new StartupDockerProcessError($t("TXT_CODE_a6424dcc"));
    if (!fs.existsSync(instance.absoluteCwdPath())) fs.mkdirpSync(instance.absoluteCwdPath());

    // Docker docks to the process adapter
    const processAdapter = new DockerProcessAdapter(new SetupDockerContainer(instance));
    await processAdapter.start({
      isTty: instance.config.terminalOption.pty,
      w: instance.config.terminalOption.ptyWindowCol,
      h: instance.config.terminalOption.ptyWindowRow
    });

    instance.started(processAdapter);
    logger.info(
      $t("TXT_CODE_instance.successful", {
        v: `${instance.config.nickname} ${instance.instanceUuid}`
      })
    );
  }
}
