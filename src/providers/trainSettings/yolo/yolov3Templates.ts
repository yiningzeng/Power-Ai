export const yolov3Template = "[net]\n" +
    "# Testing\n" +
    "# batch=1\n" +
    "# subdivisions=1\n" +
    "# Training\n" +
    "batch=${batch}\n" +
    "subdivisions=${subdivisions}\n" +
    "width=${width}\n" +
    "height=${height}\n" +
    "channels=${channels}\n" +
    "momentum=${momentum}\n" +
    "decay=${decay}\n" +
    "angle=${angle}\n" +
    "saturation=${saturation}\n" +
    "exposure=${exposure}\n" +
    "hue=${hue}\n" +
    "\n" +
    "learning_rate=${learning_rate}\n" +
    "burn_in=${burn_in}\n" +
    "max_batches=${max_batches}\n" +
    "policy=${policy}\n" +
    "steps=${steps}\n" +
    "scales=${scales}\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=32\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "# Downsample\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=64\n" +
    "size=3\n" +
    "stride=2\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=32\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=64\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "# Downsample\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=3\n" +
    "stride=2\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=64\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=64\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "# Downsample\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=3\n" +
    "stride=2\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "# Downsample\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=3\n" +
    "stride=2\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "# Downsample\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=1024\n" +
    "size=3\n" +
    "stride=2\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=1024\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=1024\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=1024\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=1024\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[shortcut]\n" +
    "from=-3\n" +
    "activation=linear\n" +
    "\n" +
    "######################\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=1024\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=1024\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=512\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=1024\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=255\n" +
    "activation=linear\n" +
    "\n" +
    "\n" +
    "[yolo]\n" +
    "mask = 6,7,8\n" +
    "anchors = 10,13,  16,30,  33,23,  30,61,  62,45,  59,119,  116,90,  156,198,  373,326\n" +
    "classes=80\n" +
    "num=9\n" +
    "jitter=.3\n" +
    "ignore_thresh = .7\n" +
    "truth_thresh = 1\n" +
    "random=1\n" +
    "\n" +
    "\n" +
    "[route]\n" +
    "layers = -4\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[upsample]\n" +
    "stride=2\n" +
    "\n" +
    "[route]\n" +
    "layers = -1, 61\n" +
    "\n" +
    "\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=512\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=512\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=256\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=512\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=255\n" +
    "activation=linear\n" +
    "\n" +
    "\n" +
    "[yolo]\n" +
    "mask = 3,4,5\n" +
    "anchors = 10,13,  16,30,  33,23,  30,61,  62,45,  59,119,  116,90,  156,198,  373,326\n" +
    "classes=80\n" +
    "num=9\n" +
    "jitter=.3\n" +
    "ignore_thresh = .7\n" +
    "truth_thresh = 1\n" +
    "random=1\n" +
    "\n" +
    "\n" +
    "\n" +
    "[route]\n" +
    "layers = -4\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[upsample]\n" +
    "stride=2\n" +
    "\n" +
    "[route]\n" +
    "layers = -1, 36\n" +
    "\n" +
    "\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=256\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=256\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "filters=128\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "batch_normalize=1\n" +
    "size=3\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=256\n" +
    "activation=leaky\n" +
    "\n" +
    "[convolutional]\n" +
    "size=1\n" +
    "stride=1\n" +
    "pad=1\n" +
    "filters=255\n" +
    "activation=linear\n" +
    "\n" +
    "\n" +
    "[yolo]\n" +
    "mask = 0,1,2\n" +
    "anchors = 10,13,  16,30,  33,23,  30,61,  62,45,  59,119,  116,90,  156,198,  373,326\n" +
    "classes=80\n" +
    "num=9\n" +
    "jitter=.3\n" +
    "ignore_thresh = .7\n" +
    "truth_thresh = 1\n" +
    "random=1\n" +
    "\n";
