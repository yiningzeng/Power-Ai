import { BrowserWindow, dialog } from "electron";
import fs from "fs";
import path from "path";
import {IProject} from "../../../models/applicationState";
import child_process from "child_process";
const exec = child_process.exec;
// 任何你期望执行的cmd命令，ls都可以

// 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
// 子进程名称
let workerProcess;
export default class TrainingSystem {

    constructor(private browserWindow: BrowserWindow) { }

    public fasterRcnn(project: IProject): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const passwordFile = process.cwd() + "/password.txt";
            const sourcePath = `${project.targetConnection.providerOptions["folderPath"]}/coco-json-export/`;
            const filePath = path.normalize(sourcePath);
            const cmdStr = "cd " + filePath + "\n" +
                "port=8097\n" +
                "while :\n" +
                "do\n" +
                "        if netstat -tlpn | grep $port\n" +
                "        then\n" +
                '                echo "端口占用"\n' +
                "                port=`expr $port + 1`\n" +
                "        else\n" +
                '                echo "$port端口可用"\n' +
                "                break\n" +
                "        fi\n" +
                "done\n" +
                "echo `cat " + passwordFile + "` | sudo -S nvidia-docker run -d -p $port:8097 -v " +
                filePath + ":/Detectron/detectron/datasets/data/ --name " +
                project.name + "-$port registry.cn-hangzhou.aliyuncs.com/baymin/ai-power:ai-power-v2.2\n" +
                "sleep 2\n" +
                "x-www-browser http://localhost:$port";
            // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
            console.log(cmdStr);
            workerProcess = exec(cmdStr);
            // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
            // 打印正常的后台可执行程序输出
            workerProcess.stdout.on("data", (data) => {
                console.log("stdout: " + data);
            });
            // 打印错误的后台可执行程序输出
            workerProcess.stderr.on("data", (data) => {
                console.log("stderr: " + data);
            });
            // 退出之后的输出
            workerProcess.on("close", (code) => {
                console.log("out code：" + code);
            });

            let win = new BrowserWindow({ width: 1800, height: 1000, show: false });
            win.on("closed", () => {
                win = null;
            });
            win.loadURL("http://localhost:8097");
            win.show();
            resolve("成功");
        });
    }

    public yolov3(project: IProject): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const passwordFile = process.cwd() + "/password.txt";
            const sourcePath = project.targetConnection.providerOptions["folderPath"] + "/"
                + project.name.replace(/\s/g, "-") + "-PascalVOC-export/";
            const filePath = path.normalize(sourcePath);
            const  cmdStr = "cd " + filePath + " && echo asdasdasdasd > aa.txt";
            // const cmdStr = "cd " + filePath + "\n" +
            //     "port=8097\n" +
            //     "while :\n" +
            //     "do\n" +
            //     "        if netstat -tlpn | grep $port\n" +
            //     "        then\n" +
            //     '                echo "端口占用"\n' +
            //     "                port=`expr $port + 1`\n" +
            //     "        else\n" +
            //     '                echo "$port端口可用"\n' +
            //     "                break\n" +
            //     "        fi\n" +
            //     "done\n" +
            //     "echo `cat " + passwordFile + "` | sudo -S nvidia-docker run -d -p $port:8097 -v " +
            //     filePath + ":/Detectron/detectron/datasets/data/ --name " +
            //     project.name + "-$port registry.cn-hangzhou.aliyuncs.com/baymin/ai-power:ai-power-v2.2\n" +
            //     "sleep 2\n" +
            //     "x-www-browser http://localhost:$port";
            // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
            console.log(cmdStr);
            workerProcess = exec(cmdStr);
            // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
            // 打印正常的后台可执行程序输出
            workerProcess.stdout.on("data", (data) => {
                console.log("stdout: " + data);
            });
            // 打印错误的后台可执行程序输出
            workerProcess.stderr.on("data", (data) => {
                console.log("stderr: " + data);
            });
            // 退出之后的输出
            workerProcess.on("close", (code) => {
                console.log("out code：" + code);
            });

            let win = new BrowserWindow({ width: 1800, height: 1000, show: false });
            win.on("closed", () => {
                win = null;
            });
            win.loadURL("http://localhost:8097");
            win.show();
            resolve("成功");
        });
    }

    /**
     * Gets the node file system stats for the specified path
     * @param  {string} path
     * @returns {Promise} Resolved path and stats
     */
    private getStats(path: string): Promise<{ path: string, stats: fs.Stats }> {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats: fs.Stats) => {
                if (err) {
                    reject(err);
                }

                resolve({
                    path,
                    stats,
                });
            });
        });
    }
}
