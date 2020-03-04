//循环更新数据库,拉取猎流任务状态更新到本项目任务表中
const {
    Worker,
    isMainThread,
    parentPort,
    workerData
} = require('worker_threads');



const mainThread = function (script) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
            workerData: script
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`工作线程使用退出码 ${code} 停止`));
        });
    });
}


const dbThread = async function () {
    const taskModel = require('../models/tasks');
    const {
        taskSearchByids
    } = require('../tool/lieliuApi');
    const script = workerData;
    const updatedSuccess = 1;
    while (updatedSuccess > 0) {
        try {
            let taskids = await taskModel.find({
                refreshms: {
                    $lte: Date.now() - 5 * 60 * 60
                }
            }).limit(20).select('taskid');
            console.log('taskids', taskids);
            updatedSuccess--;
            let idsAndStatus = await taskSearchByids(taskids);
            console.log('idsAndStatus', idsAndStatus);
            taskModel.updateStatus(idsAndStatus);

        } catch (error) {
            console.log('dbThread', error);
        }
    }
}


if (isMainThread) { //如果是主线程
    module.exports = mainThread;
} else {
    dbThread();
    parentPort.postMessage('');
}