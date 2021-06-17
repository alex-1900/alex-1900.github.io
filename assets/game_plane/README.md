## 碰撞检测
通过 collider service 检测碰撞，有两种存储结构：
- Collector: 每一帧都遍历其中的所有元素
- QuadTree: 初始化时简历四叉树，可以根据坐标缩小遍历范围

Collector 和 QuadTree 中的元素都只相互与对方做碰撞检测，这里规范为：hero 方存储在 Collector 中，enemy 方存储在 QuadTree 中，因为
enemy 方的数量比较稳定，可控。
