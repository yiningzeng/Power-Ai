import { BrowserWindow, dialog } from "electron";
import fs from "fs";
import path from "path";
import {IProject} from "../../../models/applicationState";
const exec = require('child_process').exec;
// 任何你期望执行的cmd命令，ls都可以

// 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
// 子进程名称
let workerProcess;
export default class TrainingSystem {

    constructor(private browserWindow: BrowserWindow) { }

    public startTraining(project: IProject): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let filePath=path.normalize(`${project.targetConnection.providerOptions['folderPath']}/coco-json-export/`);
            let NUM_CLASSES=project.tags.length+1;
            let NUM_GPUS=1;
            let SOLVER_GPU='';
            switch (NUM_GPUS) {
                case 1:
                    SOLVER_GPU='  BASE_LR: 0.0025\n' +
                        '  MAX_ITER: 60000\n' +
                        '  STEPS: [0, 30000, 40000]\n';
                    break;
                case 2:
                    SOLVER_GPU='  BASE_LR: 0.005\n' +
                        '  MAX_ITER: 30000\n' +
                        '  STEPS: [0, 15000, 20000]\n';
                    break;
                case 4:
                    SOLVER_GPU='  BASE_LR: 0.01\n' +
                        '  MAX_ITER: 15000\n' +
                        '  STEPS: [0, 7500, 10000]\n';
                    break;
                case 8:
                    SOLVER_GPU='  BASE_LR: 0.02\n' +
                        '  MAX_ITER: 7500\n' +
                        '  STEPS: [0, 3750, 5000]\n';
                    break;
                default:
                    SOLVER_GPU='  BASE_LR: 0.0025\n' +
                    '  MAX_ITER: 60000\n' +
                    '  STEPS: [0, 30000, 40000]\n';
            }
            console.log(path.normalize(filePath));
            let sudoPas='baymin1024';
            let cmdStr = 'cd '+ filePath +'\n' +
                'mkdir -p train/coco/annotations train/coco/coco_train2014 train/coco/coco_val2014\n' +
                'mv *.png train/coco/coco_train2014\n' +
                'cp train/coco/coco_train2014/*.png train/coco/coco_val2014\n' +
                'mv *.pjson train/coco/coco_train2014\n' +
                'port=8097\n' +
                'while :\n' +
                'do\n' +
                '        if netstat -tlpn | grep $port\n' +
                '        then\n' +
                '                echo "端口占用"\n' +
                '                port=`expr $port + 1`\n' +
                '        else\n' +
                '                echo "$port端口可用"\n' +
                '                break\n' +
                '        fi\n' +
                'done\n' +
                'echo '+sudoPas+'\n'+
                'tee train/tutorial_faster_rcnn_R-50-FPN.yaml <<-\'EOF\'\n' +
                'MODEL:\n' +
                '  TYPE: generalized_rcnn\n' +
                '  CONV_BODY: FPN.add_fpn_ResNet50_conv5_body\n' +
                '  NUM_CLASSES: '+ NUM_CLASSES +'\n' +
                '  FASTER_RCNN: True\n' +
                'NUM_GPUS: '+ NUM_GPUS +'\n' +
                'SOLVER:\n' +
                '  WEIGHT_DECAY: 0.0001\n' +
                '  LR_POLICY: steps_with_decay\n' +
                '  GAMMA: 0.1\n' +
                SOLVER_GPU +
                'FPN:\n' +
                '  FPN_ON: True\n' +
                '  MULTILEVEL_ROIS: True\n' +
                '  MULTILEVEL_RPN: True\n' +
                'FAST_RCNN:\n' +
                '  ROI_BOX_HEAD: fast_rcnn_heads.add_roi_2mlp_head\n' +
                '  ROI_XFORM_METHOD: RoIAlign\n' +
                '  ROI_XFORM_RESOLUTION: 7\n' +
                '  ROI_XFORM_SAMPLING_RATIO: 2\n' +
                'TRAIN:\n' +
                '  WEIGHTS: /Detectron/models/R-50.pkl #https://dl.fbaipublicfiles.com/detectron/ImageNetPretrained/MSRA/R-50.pkl\n' +
                '  DATASETS: (\'coco_2014_train\',)\n' +
                '  SCALES: (500,)\n' +
                '  MAX_SIZE: 833\n' +
                '  BATCH_SIZE_PER_IM: 256\n' +
                '  RPN_PRE_NMS_TOP_N: 2000  # Per FPN level\n' +
                'TEST:\n' +
                '  DATASETS: (\'coco_2014_minival\',)\n' +
                '  SCALE: 500\n' +
                '  MAX_SIZE: 833\n' +
                '  NMS: 0.5\n' +
                '  RPN_PRE_NMS_TOP_N: 1000  # Per FPN level\n' +
                '  RPN_POST_NMS_TOP_N: 1000\n' +
                'OUTPUT_DIR: .\n' +
                'EOF\n' +
                'echo '+sudoPas+' |sudo -S nvidia-docker run -d -p $port:8097 -v '+ filePath +'train:/Detectron/detectron/datasets/data --name '+ project.name +'-$port registry.cn-hangzhou.aliyuncs.com/baymin/wfylozj:deeplearning-auto-v1.8\n' +
                'sleep 2\n' +
                'x-www-browser http://localhost:$port';
            // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
            console.log(cmdStr);
            workerProcess = exec(cmdStr);
            // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
            // 打印正常的后台可执行程序输出
            workerProcess.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
            });
            // 打印错误的后台可执行程序输出
            workerProcess.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });
            // 退出之后的输出
            workerProcess.on('close', function (code) {
                console.log('out code：' + code);
            });

            var win = new BrowserWindow({ width: 1800, height: 1000, show: false });
            win.on('closed', function() {
                win = null;
            });
            win.loadURL('http://localhost:8097');
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
