import { BrowserWindow, dialog, shell} from "electron";
import fs from "fs";
import ftp from "ftp";
import got from "got";
import util from "util";
import path from "path";
import yaml from "js-yaml";
import archiver from "archiver";
import hddserial from "hddserial";
import FormData from "form-data";
// const Client = require("ftp");
import {IProject, IProjectItem, IRemoteHostItem} from "../../../models/applicationState";
import child_process from "child_process";
import has = Reflect.has;
import {IStartTrainResults} from "../../../providers/export/exportProvider";
import Guard from "../../../common/guard";
import {toast} from "react-toastify";
import _ from "lodash";
import {constants} from "../../../common/constants";
import axios from "axios";
const exec = child_process.exec;
// 任何你期望执行的cmd命令，ls都可以

// 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
// 子进程名称
export default class TrainingSystem {

    constructor(private browserWindow: BrowserWindow) { }
    // region 弃用
    public fasterRcnn(project: IProject): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (project.trainFormat.ip !== "localhost") {
                resolve(this.remoteTrain(project));
                return;
            }
            let workerProcess;
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
                project.name + "-$port registry.cn-hangzhou.aliyuncs.com/baymin/ai-power:ai-power-v2.5\n" +
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

            // let win = new BrowserWindow({ width: 1800, height: 1000, show: false });
            // win.on("closed", () => {
            //     win = null;
            // });
            // win.loadURL("http://localhost:8097");
            // win.show();
            // resolve("成功");
        });
    }

    public maskRcnn(project: IProject): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (project.trainFormat.ip !== "localhost") {
                resolve(this.remoteTrain(project));
                return;
            }
            let workerProcess;
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

            // let win = new BrowserWindow({ width: 1800, height: 1000, show: false });
            // win.on("closed", () => {
            //     win = null;
            // });
            // win.loadURL("http://localhost:8097");
            // win.show();
            resolve("成功");
        });
    }

    public yolov3(project: IProject): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (project.trainFormat.ip !== "localhost") {
                resolve(this.remoteTrain(project));
                return;
            }
            let workerProcess;
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
    // endregion

    // 首页远程主机的操作
    public RemoteHostEdit(oneHost: IRemoteHostItem, remove?: boolean): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            if (remove) {
                console.log("删除");
                fs.readFile(constants.remoteHostFileName, "utf-8", (err, data) => {
                    if (err) {
                        reject(false);
                    } else {
                        let jsonList: IRemoteHostItem[] = _.values(JSON.parse(data));
                        jsonList = jsonList.filter((v) => v.name !== oneHost.name);
                        // tslint:disable-next-line:max-line-length
                        fs.writeFileSync(constants.remoteHostFileName, JSON.stringify(_.keyBy(jsonList, (v) => v.name), null, 4), "utf8");
                        resolve(true);
                    }
                });
            } else { // 新增
                console.log("新增");
                try {
                    fs.statSync(constants.remoteHostFileName);
                    // 如果能执行到这里，那么表示savePath文件存在
                    fs.readFile(constants.remoteHostFileName, "utf-8", (err, data) => {
                        if (err) {
                            reject(false);
                        } else {
                            const jsonList = JSON.parse(data);
                            jsonList[oneHost.name] = oneHost;
                            fs.writeFileSync(constants.remoteHostFileName, JSON.stringify(jsonList, null, 4), "utf8");
                            resolve(true);
                        }
                    });
                } catch (e) { // 这里是新增
                    fs.writeFileSync(constants.remoteHostFileName, `{"${oneHost.name}": ${JSON.stringify(oneHost)}}`, "utf8");
                    resolve(true);
                }
            }
        });
    }

    // 首页项目的操作
    public ProjectEdit(projectItem: IProjectItem, remove?: boolean): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            if (remove) {
                console.log("删除");
                fs.readFile(constants.projectFileName, "utf-8", (err, data) => {
                    if (err) {
                        reject(false);
                    } else {
                        let jsonList: IRemoteHostItem[] = _.values(JSON.parse(data));
                        jsonList = jsonList.filter((v) => v.name !== projectItem.ProjectName);
                        // tslint:disable-next-line:max-line-length
                        fs.writeFileSync(constants.projectFileName, JSON.stringify(_.keyBy(jsonList, (v) => v.name), null, 4), "utf8");
                        resolve(true);
                    }
                });
            } else { // 新增
                console.log("新增");
                try {
                    fs.statSync(constants.projectFileName);
                    // 如果能执行到这里，那么表示savePath文件存在
                    fs.readFile(constants.projectFileName, "utf-8", (err, data) => {
                        if (err) {
                            reject(false);
                        } else {
                            const jsonList = JSON.parse(data);
                            jsonList[projectItem.ProjectName] = projectItem;
                            fs.writeFileSync(constants.projectFileName, JSON.stringify(jsonList, null, 4), "utf8");
                            resolve(true);
                        }
                    });
                } catch (e) { // 这里是新增
                    fs.writeFileSync(constants.projectFileName, `{"${projectItem.ProjectName}": ${JSON.stringify(projectItem)}}`, "utf8");
                    resolve(true);
                }
            }
        });
    }

    // 注意了这里sourcePath和targetPath都要已/结尾
    public RootDeletePath(delPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let workerProcess;

            const passwordFile = process.cwd() + "/sudo.txt";
            const cmdStr = `echo \`cat "${passwordFile}"\` | sudo -S  rm -r "${delPath}"`;
            console.log(cmdStr);
            workerProcess = child_process.exec(cmdStr, (error, stdout, stderr) => {
                if (error) {
                    console.error(`执行的错误: ${error}`);
                    console.error(`stderr: ${stderr}`);
                }
                console.log(`stdout: ${stdout}`);
            });
            // 退出之后的输出
            workerProcess.on("close", (code) => {
                console.log("out code：" + code);
                let res = false;
                if (code === 0) {
                    console.log("执行成功");
                    res = true;
                } else {
                    console.log("执行失败");
                }
                res ? resolve(true) : reject(false);
            });
        });
    }

    public YamlSave(filePath: string, str: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                fs.writeFileSync(filePath, yaml.dump(str), "utf8");
                resolve(true);
            } catch (e) {
                console.log(e);
                reject(false);
            }
        });
    }

    public YamlRead(filePath: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                fs.statSync(filePath);
                // 如果能执行到这里，那么表示savePath文件存在
                resolve(yaml.load(fs.readFileSync(filePath, "utf8")));
            } catch (e) {
                console.log(e);
                reject("");
            }
        });
    }

    public JsonSave(filePath: string, str: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                fs.writeFileSync(filePath, JSON.stringify(str, null, 4), "utf8");
                resolve(true);
            } catch (e) {
                console.log(e);
                reject(false);
            }
        });
    }

    public JsonRead(filePath: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                fs.statSync(filePath);
                // 如果能执行到这里，那么表示savePath文件存在
                fs.readFile(filePath, "utf-8", (err, data) => {
                    if (err) {
                        resolve("{}");
                    } else {
                        resolve(data);
                    }
                });
            } catch (e) {
                console.log(e);
                resolve("{}");
            }
        });
    }

    // 判断文件是否存在
    public OpenProjectDir(path: string): void {
        shell.showItemInFolder(path);
    }

    // 判断文件是否存在
    public FileExist(path: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            const res = await fs.existsSync(path);
            res ? resolve(true) : reject(false);
        });
    }

// 检测端口是否被占用

    public CheckServer(port: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            const net = require("net");
            // 创建服务并监听该端口
            const server = net.createServer().listen(port);
            server.on("listening", () => { // 执行这块代码说明端口未被占用
                server.close(); // 关闭服务
                console.log("The port【" + port + "】 is available."); // 控制台输出信息
                resolve(true);
            });
            server.on("error", (err) => {
                if (err.code === "EADDRINUSE") { // 端口已经被使用
                    console.log("The port【" + port + "】 is occupied, please change other port.");
                }
                reject(false);
            });
        });
    }

    public StartServer(shellName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let workerProcess;
            const shellPath = process.cwd() + "/" + shellName;
            const cmdStr = `sh ${shellPath}`;
            console.log(cmdStr);
            workerProcess = child_process.exec(cmdStr, (error, stdout, stderr) => {
                if (error) {
                    console.error(`执行的错误: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    return;
                }
            });
            // 退出之后的输出
            workerProcess.on("close", (code) => {
                console.log("out code：" + code);
                let res = false;
                if (code === 0) {
                    console.log("执行成功");
                    res = true;
                } else {
                    console.log("执行失败");
                }
                res ? resolve("success") : reject("failed");
            });
        });
    }

    // 注意了这里sourcePath和targetPath都要已/结尾
    public ExportPowerAiAssets(sourcePath: string, targetPath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let workerProcess;

            const passwordFile = process.cwd() + "/sudo.txt";
            const cmdStr = `echo \`cat "${passwordFile}"\` | sudo -S rsync -aW --include="*.json" --include="*.gif" --include="*.jpg" --include="*.jpeg" --include="*.tif" --include="*.tiff" --include="*.png" --include="*.bmp" --exclude="*"  "${sourcePath}" "${targetPath}"`;
            console.log(cmdStr);
            workerProcess = child_process.exec(cmdStr, (error, stdout, stderr) => {
                if (error) {
                    console.error(`执行的错误: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            // 退出之后的输出
            workerProcess.on("close", (code) => {
                console.log("out code：" + code);
                let res = false;
                if (code === 0) {
                    console.log("执行成功");
                    res = true;
                } else {
                    console.log("执行失败");
                }
                res ? resolve("success") : reject("导出失败");
            });
        });
    }

    // 弃用
    public CalProgress(path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let workerProcess;
            const allNumFile = process.cwd() + "/allNum.txt";
            const jsonListFile = process.cwd() + "/jsonList.txt";
            const cmdStr = `echo 0 > now.txt && ls "${path}" | grep ".json" > "${jsonListFile}" && ls "${path}" | grep ".json" |wc -l > "${allNumFile}"`;
            console.log(cmdStr);
            workerProcess = child_process.exec(cmdStr, (error, stdout, stderr) => {
                if (error) {
                    console.error(`执行的错误: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            // 退出之后的输出
            workerProcess.on("close", (code) => {
                console.log("out code：" + code);
                let res = false;
                if (code === 0) {
                    console.log("执行成功");
                    res = true;
                } else {
                    console.log("执行失败");
                }
                res ? resolve("success") : reject("计算文件数目出错或者素材全部未标记过");
            });
        });
    }

    public ClearProgress(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let workerProcess;
            const nowFile = process.cwd() + "/now.txt";
            const allNumFile = process.cwd() + "/allNum.txt";
            const cmdStr = `rm '${nowFile}' && rm '${allNumFile}'`;
            console.log(cmdStr);
            workerProcess = child_process.exec(cmdStr, (error, stdout, stderr) => {
                if (error) {
                    console.error(`执行的错误: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    return;
                }
            });
            // 退出之后的输出
            workerProcess.on("close", (code) => {
                console.log("out code：" + code);
                let res = false;
                if (code === 0) {
                    console.log("执行成功");
                    res = true;
                } else {
                    console.log("执行失败");
                }
                res ? resolve("success") : reject("failed");
            });
        });
    }

    public GetProgress(): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            await axios.get("http://localhost:1122/v1/monkeySun/now").then(async (response) => {
                if (response.data["Code"] === 200 ) {
                    resolve(response.data["Data"]);
                } else {
                    reject(0);
                }
            });
        });
    }

    // go请来的救兵！
    public MonkeySun(path: string, threadNum: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let workerProcess;
            console.log("\n--------------MonkeySun-comming----------------");
            const threadNumFile = process.cwd() + "/threadNum.data";
            const monkeySunFile = process.cwd() + "/monkeySun";
            const cmdStr = `${monkeySunFile} -path='${path}' -tn=\`cat ${threadNumFile}\``;
            console.log(cmdStr);
            workerProcess = child_process.exec(cmdStr, (error, stdout, stderr) => {
                if (error) {
                    console.error(`执行的错误: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            // 退出之后的输出
            workerProcess.on("close", (code) => {
                console.log("out code：" + code);
                let res = false;
                if (code === 0) {
                    console.log("执行成功");
                    res = true;
                } else {
                    console.log("执行失败");
                }
                console.log("\n--------------MonkeySun-leaving----------------");
                console.log("*");
                console.log("*");
                res ? resolve("success") : reject("failed");
            });
        });
    }

    // 加载远程图片集
    public LoadRemoteAssets(ip: string, remotePath: string, username: string, password: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let workerProcess;
            console.log("\n--------------start加载远程文件夹-----------------");
            console.log(remotePath);
            const passwordFile = process.cwd() + "/sudo.txt";
            const localPath = `/qtingvisionfolder/Remote_Assets/${ip}|${this.replaceAll("/", "|", remotePath)}`;
            const cmdStr = `echo \`cat "${passwordFile}"\` | sudo -S mkdir -p "${localPath}" && sudo mount -t cifs -o user=${username},password=${password},dir_mode=0777,file_mode=0777 "//${ip}/${remotePath}" "${localPath}"`;
            console.log(cmdStr);
            workerProcess = child_process.exec(cmdStr, (error, stdout, stderr) => {
                if (error) {
                    console.error(`执行的错误: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            // 退出之后的输出
            workerProcess.on("close", (code) => {
                console.log("out code：" + code);
                console.log("\n--------------end加载远程文件夹-----------------\n");
                console.log("*");
                console.log("*");
                if (code === 0) {
                    resolve(localPath);
                } else {
                    reject("fail");
                }
            });
        });
    }

    // 关闭远程图片集
    public CloseRemoteAssets(ip: string, remotePath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let workerProcess;
            console.log("\n--------------start关闭远程文件夹-----------------");
            const passwordFile = process.cwd() + "/sudo.txt";
            const localPath = `/qtingvisionfolder/Remote_Assets/${ip}|${this.replaceAll("/", "|", remotePath)}`;
            const cmdStr = `echo \`cat "${passwordFile}"\` | sudo -S umount -f "${localPath}"`;
            console.log(cmdStr);
            workerProcess = child_process.exec(cmdStr, (error, stdout, stderr) => {
                if (error) {
                    console.error(`执行的错误: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            // 退出之后的输出
            workerProcess.on("close", (code) => {
                console.log("out code：" + code);
                let res = false;
                if (code === 0) {
                    console.log("执行成功");
                    workerProcess = exec(`echo \`cat "${passwordFile}"\` | sudo -S rm -r "${localPath}"`);
                    console.log(`\n执行成功后删除文件夹-${localPath}`);
                    res = true;
                } else {
                    console.log("执行失败");
                }
                console.log("\n--------------end关闭远程文件夹-----------------\n");
                console.log("*");
                console.log("*");
                res ? resolve(localPath) : reject("执行失败");
            });
        });
    }

    // 复制远程图片到本机
    public CopyRemoteAssets(sourcePath: string, savePath: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let workerProcess;
            console.log("\n--------------start复制远程图片到本机-----------------");
            const passwordFile = process.cwd() + "/sudo.txt";
            const cmdStr = `echo \`cat "${passwordFile}"\` | sudo -S cp -r "${sourcePath}" "${savePath}" && sudo chmod -R 777 "${savePath}"`;
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
                console.log("\n--------------end复制远程图片到本机-----------------\n");
                console.log("*");
                console.log("*");
                if (code === 0) {
                    resolve("success");
                } else {
                    reject("fail");
                }
            });
        });
    }

    public remoteTrain(project: IProject): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            console.log(`开始打包`);
            const sourcePath = `${project.targetConnection.providerOptions["folderPath"]}`;
            // 打包的tar文件名
            const myDate = new Date();
            let month = myDate.getMonth() + 1;
            // @ts-ignore
            month = (month < 10 ? "0" + month : month);
            let day = myDate.getDate();
            // @ts-ignore
            day = (day < 10 ? "0" + day : day);
            const date = `${myDate.getFullYear()}${month.toString()}${day.toString()}`; // 获取当前时间比如 20190808
            const tarBaseName = `train-assets-${project.name}-${project.trainFormat.providerType}-${date}`; // 组合tar的基本名
            const tarName = `${tarBaseName}.tar`;
            // tar路径
            const tarPath = path.normalize(`${sourcePath}/${tarName}`);
            console.log(`${tarPath}`);
            const output = fs.createWriteStream(tarPath);
            const archive = archiver("tar", {
                zlib: { level: 9 }, // Sets the compression level.
            });
            output.on("close", () => {
                console.log(archive.pointer() + " total bytes");
                console.log(`${tarName} 打包完成`);
                console.log("archiver has been finalized and the output file descriptor has closed.");
                const config = {
                    host: project.trainFormat.ip,
                    user: "ftpicubic",
                    password: "ftpicubic-123",
                };
                const c = new ftp();
                c.on("ready", () => {
                    c.cwd("data", (er, curDir) => {
                        console.log(`fucking cwd: ${curDir}`);
                        c.put(tarPath, `${tarName}`, (err) => {
                            if (err) {
                                throw err;
                            }
                            c.end();
                            console.log("上传成功");
                            const packageInfo = {
                                projectId: project.id,
                                projectName: project.name,
                                packageDir: tarBaseName,
                                packageName: tarName,
                            };
                            const trainInfo = {
                                projectId: project.id,
                                projectName: project.name,
                                assetsDir: tarBaseName,
                                assetsType: project.exportFormat.providerType,
                                ...project.trainFormat,
                            };
                            // http://www.squaremobius.net/amqp.node/channel_api.html api文档
                            // rabbitmq
                            const trainExchange = "ai.train.topic";
                            const packageExchange = "ai.package.topic";
                            const amqplib = require("amqplib")
                                .connect(`amqp://baymin:baymin1024@${project.trainFormat.ip}:5672`);
                            // Publisher
                            amqplib.then((conn) => {
                                return conn.createChannel();
                            }).then((ch) => {
                                ch.publish(packageExchange,
                                    `package.upload-done.${project.name}.${project.trainFormat.providerType}`,
                                    Buffer.from(JSON.stringify(packageInfo)));
                                ch.publish(trainExchange,
                                    `train.start.${project.name}.${project.trainFormat.providerType}`,
                                    Buffer.from(JSON.stringify(trainInfo)));
                                // ch.assertExchange(exchange, "topic").then(() => {
                                //     console.log("creat Exchange success");
                                // }).catch((err) => {
                                //     console.log("creat Exchange failed");
                                //     console.log(err);
                                // });
                                // return ch.assertQueue(q).then((ok) => {
                                //     console.log(ok);
                                //     ch.bindQueue(q, exchange, "train.start.#");
                                //     // return ch.sendToQueue(q, Buffer.from("something to do"));
                                // });
                            }).catch(console.warn);

                            // Consumer
                            // amqplib.then((conn) => {
                            //     return conn.createChannel();
                            // }).then((ch) => {
                            //     return ch.assertQueue(q).then((ok) => {
                            //         return ch.consume(q, (msg) => {
                            //             if (msg !== null) {
                            //                 console.log(`get masg ${msg.content.toString()}`);
                            //                 ch.ack(msg);
                            //             }
                            //         });
                            //     });
                            // }).catch(console.warn);

                            // const form = new FormData();
                            // form.append("username", "baymin");
                            // form.append("password", "e10adc3949ba59abbe56e057f20f883e");
                            // got("http://rest.yining.site:8080/api/v1/u2", {
                            //     body: form,
                            //     method: "POST",
                            // }).then((response) => {
                            //     console.log("进来了大爷");
                            //     console.log(response.body);
                            // }).catch((error) => {
                            //     console.log("错误了");
                            //     console.log(error.response.body);
                            // });

                        });
                        });
                });
                // connect to localhost:21 as anonymous
                c.connect(config);
            });
            output.on("end", () => {
                console.log("Data has been drained");
            });
            archive.on("warning", (err) => {
                if (err.code === "ENOENT") {
                    // log warning
                } else {
                    // throw error
                    throw err;
                }
            });
            archive.on("error", (err) => {
                throw err;
            });
            archive.pipe(output);
            // archive.file("/home/baymin/daily-work/new-work/素材/cizhuan/ceshi.txt", { name: "file4.txt" });
            // archive.file("/home/baymin/daily-work/new-work/素材/cizhuan/ceshi.txt");
            let assetsBasePath = "coco-json-export/";
            switch (project.exportFormat.providerType) {
                case "coco":
                    assetsBasePath = "coco-json-export/";
                    break;
                case "pascalVOC":
                    assetsBasePath = `${project.name}-PascalVOC-export/`;
                    break;
                case "tensorFlowRecords":
                    console.log("暂时不支持tensorFlowRecords数据集的远程训练");
                    resolve("暂时不支持tensorFlowRecords数据集的远程训练");
                    break;
            }
            archive.directory(path.normalize(`${sourcePath}/${assetsBasePath}/`), tarBaseName);
            archive.finalize();
            resolve("xasdasdsadsadasdsad");
        });
        // toast.success("开始打包");
        // tar.c(
        //     {
        //         gzip: true,
        //         file: "/home/baymin/daily-work/new-work/素材/cizhuan/打包.tgz",
        //     },
        //     ["/home/baymin/daily-work/new-work/素材/cizhuan/ceshi.txt",
        //         "/home/baymin/daily-work/new-work/素材/cizhuan/coco-json-export/"],
        // ).then( () => { toast.success("打包成功"); });
        // ftp使用教程 https://www.npmjs.com/package/ftp
        // 打包 https://www.npmjs.com/package/archiver

        // return new Promise<string>((resolve, reject) => {
        //     const config = {
        //         host: "192.168.31.157",
        //         user: "baymin",
        //         password: "baymin1024",
        //     };
        //     const c = new ftp();
        //     c.on("ready", () => {
        //         c.put("/home/baymin/daily-work/auto-daily/2019-08-03", "README.md", (err) => {
        //             if (err) { throw err; }
        //             console.log("上传成功");
        //             c.end();
        //         });
        //     });
        //     // connect to localhost:21 as anonymous
        //     c.connect(config);
        //     resolve("成功");
        // });
    }

    public trainPackageProject(project: IProject): Promise<IStartTrainResults> {
        return new Promise<IStartTrainResults>((resolve, reject) => {
            let res: IStartTrainResults = {
                success: false,
                msg: "null",
            };

            console.log(`开始打包`);
            const sourcePath = `${project.targetConnection.providerOptions["folderPath"]}`;
            // 打包的tar文件名
            const myDate = new Date();
            let month = myDate.getMonth() + 1;
            // @ts-ignore
            month = (month < 10 ? "0" + month : month);
            let day = myDate.getDate();
            // @ts-ignore
            day = (day < 10 ? "0" + day : day);
            const date = `${myDate.getFullYear()}${month.toString()}${day.toString()}`; // 获取当前时间比如 20190808
            const tarBaseName = `${date}-auto-${project.name}-${project.trainFormat.providerType}`;
            const tarName = `${tarBaseName}.tar`;
            // tar路径
            const tarPath = path.normalize(`${sourcePath}/${tarName}`);
            console.log(`${tarPath}`);
            const output = fs.createWriteStream(tarPath);
            const archive = archiver("tar", {
                zlib: {level: 9}, // Sets the compression level.
            });
            output.on("close", () => {
                console.log(archive.pointer() + " total bytes");
                console.log(`${tarName} 打包完成`);
                console.log("archiver has been finalized and the output file descriptor has closed.");

                res = {
                    ...res,
                    success: true,
                    tarPath,
                    tarName,
                    tarBaseName,
                    sourcePath,
                    assetsBasePath,
                    msg: "打包成功",
                };
                resolve(res);
            });
            output.on("end", () => {
                console.log("Data has been drained");
            });
            archive.on("warning", (err) => {
                if (err.code === "ENOENT") {
                    // log warning
                } else {
                    // throw error
                    throw err;
                }
            });
            archive.on("error", (err) => {
                res = {
                    ...res,
                    success: false,
                    msg: `打包失败，请检查。错误信息:${err.toString()}`,
                };
                resolve(res);
            });
            archive.pipe(output);
            // archive.file("/home/baymin/daily-work/new-work/素材/cizhuan/ceshi.txt", { name: "file4.txt" });
            // archive.file("/home/baymin/daily-work/new-work/素材/cizhuan/ceshi.txt");
            let assetsBasePath = "coco-json-export/";
            switch (project.exportFormat.providerType) {
                case "coco":
                    assetsBasePath = "coco-json-export/";
                    break;
                case "pascalVOC":
                    assetsBasePath = `${project.name}-PascalVOC-export/`;
                    break;
                case "tensorFlowRecords":
                    console.log("暂时不支持tensorFlowRecords数据集的远程训练");
                    res = {
                        ...res,
                        success: false,
                        msg: `暂时不支持tensorFlowRecords数据集的远程训练`,
                    };
                    resolve(res);
            }
            archive.directory(path.normalize(`${sourcePath}/${assetsBasePath}/`), tarBaseName);
            archive.finalize();
        });
    }

    public trainUploadProject(project: IProject, source: IStartTrainResults): Promise<IStartTrainResults> {
        return new Promise<IStartTrainResults>((resolve, reject) => {
            Guard.null(project);
            Guard.null(source);
            let res: IStartTrainResults = {
                success: false,
                msg: "null",
            };
            const config = {
                host: project.trainFormat.ip,
                user: "ftpicubic",
                password: "ftpicubic-123",
            };
            const c = new ftp();
            c.on("ready", () => {
                c.put(source.tarPath, source.tarName, (err) => {
                    if (err) {
                        res = {...res, msg: "Ftp上传失败"};
                        return res;
                    }
                    c.end();
                    console.log("上传成功");
                    res = {
                        ...res,
                        success: true,
                        msg: `上传成功`,
                    };
                    resolve(res);

                    const packageInfo = {
                        projectId: project.id,
                        projectName: project.name,
                        packageDir: source.tarBaseName,
                        packageName: source.tarName,
                    };
                    const trainInfo = {
                        projectId: project.id,
                        projectName: project.name,
                        assetsDir: source.tarBaseName,
                        assetsType: project.exportFormat.providerType,
                        ...project.trainFormat,
                    };
                    // http://www.squaremobius.net/amqp.node/channel_api.html api文档
                    // rabbitmq
                    const trainExchange = "ai.train.topic";
                    const packageExchange = "ai.package.topic";
                    const amqplib = require("amqplib")
                        .connect(`amqp://baymin:baymin1024@${project.trainFormat.ip}:5672`);
                    // Publisher
                    amqplib.then((conn) => {
                        return conn.createChannel();
                    }).then((ch) => {
                        ch.publish(packageExchange,
                            `package.upload-done.${project.name}.${project.trainFormat.providerType}`,
                            Buffer.from(JSON.stringify(packageInfo)));
                        ch.publish(trainExchange,
                            `train.start.${project.name}.${project.trainFormat.providerType}`,
                            Buffer.from(JSON.stringify(trainInfo)));
                    }).catch(console.warn);
                });
            });
            // connect to localhost:21 as anonymous
            c.on("error", (err) => {
                res = {...res, msg: "Ftp上传失败"};
                resolve(res);
            });
            c.connect(config);
        });
    }

    public trainAddQueueProject(project: IProject, source: IStartTrainResults): Promise<IStartTrainResults> {
        return new Promise<IStartTrainResults>((resolve, reject) => {
            let res: IStartTrainResults = {
                success: false,
                msg: "null",
            };
            Guard.null(project);
            Guard.null(source);
            const packageInfo = {
                projectId: project.id,
                projectName: project.name,
                packageDir: source.tarBaseName,
                packageName: source.tarName,
            };
            const trainInfo = {
                projectId: project.id,
                projectName: project.name,
                assetsDir: source.tarBaseName,
                assetsType: project.exportFormat.providerType,
                ...project.trainFormat,
            };
            const trainExchange = "ai.train.topic";
            const packageExchange = "ai.package.topic";
            const amqplib = require("amqplib")
                .connect(`amqp://baymin:baymin1024@${project.trainFormat.ip}:5672`);
            // Publisher
            amqplib.then((conn) => {
                return conn.createChannel();
            }).then((ch) => {
                ch.publish(packageExchange,
                    `package.upload-done.${project.name}.${project.trainFormat.providerType}`,
                    Buffer.from(JSON.stringify(packageInfo)));
                ch.publish(trainExchange,
                    `train.start.${project.name}.${project.trainFormat.providerType}`,
                    Buffer.from(JSON.stringify(trainInfo)));
                ch.close();
                res = {
                    ...res,
                    success: true,
                    msg: `成功加入训练队列`,
                };
                resolve(res);
            }).catch((err) => {
                res = {
                    ...res,
                    success: false,
                    msg: `加入训练队列失败，请咨询开发人员`,
                };
                resolve(res);
            });

            // let win = new BrowserWindow({ width: 1800, height: 1000, show: false });
            // win.on("closed", () => {
            //     win = null;
            // });
            // win.loadURL(`http://${project.trainFormat.ip}`);
            // win.show();
        });
    }

    public trainAddSql(project: IProject, source: IStartTrainResults): Promise<IStartTrainResults> {
        return new Promise<IStartTrainResults>((resolve, reject) => {
            let res: IStartTrainResults = {
                success: false,
                msg: "null",
            };
            const packageInfo = {
                projectId: project.id,
                projectName: project.name,
                packageDir: source.tarBaseName,
                packageName: source.tarName,
            };
            got("http://server.qtingvision.com:888/power-ai-train", {
                body: packageInfo,
                method: "POST",
                json: true,
            }).then((response) => {
                if (response.res === "ok") {
                    res = {
                        ...res,
                        success: true,
                        msg: `成功加入训练队列`,
                    };
                }
                console.log(response.body);
            }).catch((error) => {
                res = {
                    ...res,
                    success: false,
                    msg: ``,
                };
            });
            resolve(res);
        });
    }

    // public opencvTest() {
    //
    //
    //     console.log("进来了");
    //     Promise.all([
    //         import("/home/baymin/daily-work/Power-Ai/node_modules/react-split-pane"),
    //     ]).then(([SplitPane]) => {
    //         console.log("asdsdsdsdsdsd");
    //         console.log(SplitPane);
    //         console.log("asdsdsdsdsdsd");
    //         // const minBboxsNotP = [];
    //         // minBboxsNotP.push([123, 234]);
    //         // minBboxsNotP.push([224, 255]);
    //         // minBboxsNotP.push([455, 90]);
    //         // minBboxsNotP.push([88, 90]);
    //         // const bboxs = findBounds(minBboxsNotP);
    //         // console.log("\n=============================\n");
    //         // console.log(`变变变${JSON.stringify(bboxs)}`);
    //         // console.log("\n=============================\n");
    //         /* CODE HERE*/
    //     }).catch((e) => {
    //         console.log(e);
    //     });
    //     // region 插件库
    //     // Promise.all([
    //     //     import("/home/baymin/daily-work/Power-Ai/node_modules/getboundingbox"),
    //     // ]).then(([fuck]) => {
    //     //     const minBboxsNotP = [];
    //     //     minBboxsNotP.push([123, 234]);
    //     //     minBboxsNotP.push([224, 255]);
    //     //     minBboxsNotP.push([455, 90]);
    //     //     minBboxsNotP.push([88, 90]);
    //     //     const bboxs = fuck.bb(minBboxsNotP);
    //     //     console.log("\n=============================\n");
    //     //     console.log(`变变变${JSON.stringify(bboxs)}`);
    //     //     console.log("\n=============================\n");
    //     //     /* CODE HERE*/
    //     // }).catch((e) => {
    //     //     console.log(e);
    //     // });
    //     //
    //     // Promise.all([
    //     //     import("/home/baymin/daily-work/Power-Ai/node_modules/getboundingbox"),
    //     // ]).then(([fuck]) => {
    //     //     const minBboxsNotP = [];
    //     //     minBboxsNotP.push([123, 234]);
    //     //     minBboxsNotP.push([224, 255]);
    //     //     minBboxsNotP.push([455, 90]);
    //     //     minBboxsNotP.push([88, 90]);
    //     //     const bboxs = fuck.cc(minBboxsNotP);
    //     //     console.log("\n=============================\n");
    //     //     console.log(`变变变${JSON.stringify(bboxs)}`);
    //     //     console.log("\n=============================\n");
    //     //     /* CODE HERE*/
    //     // }).catch((e) => {
    //     //     console.log(e);
    //     // });
    //     // endregion 插件库
    //
    //     // hddserial.first((err, serial) => {
    //     //     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaahdd serial for first hdd : %s", serial);
    //     // });
    //     // const mat = cv.imread("/home/baymin/图片/1964668478.jpg");
    //     // cv.imwrite("/home/baymin/图片/opencv4nodejs.jpg", mat);
    //     // cv.imshow("a window name", mat);
    //     // cv.waitKey();
    //     // const mat = cv.imread("/home/baymin/图片/1964668478.jpg");
    //     // cv.imshow("a window name", mat);
    //     // cv.waitKey();
    // }
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

    private replaceAll(find, replace, str): string {
        return str.replace(new RegExp(find, "g"), replace);
    }
}
