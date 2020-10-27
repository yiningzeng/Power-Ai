power-ai

# 针对pytorch版本的yolov3，需要注意
> both batch_size and number of train.txt rows should always be divisible by the number of GPUs
>
>### 首页的一些处理逻辑
>* 打开远程文件夹 此处是需要人工手动标注的 所以默认都放到项目下的CollectData目录里
>* 远程拷图 这里是不需要标注的 所有的素材都直接复制到AtuoTrainData目录
>* 查找条码标图 根据查询的图片数据 标记后导出统一保存到MissData目录
