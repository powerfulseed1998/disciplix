import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export const compressImage = async (uri: string) => {
    try {
        // 1. 创建上下文
        const context = ImageManipulator.manipulate(uri);

        // 2. 添加操作
        context.resize({ width: 800 });

        // 3. 它返回一个 imageRef，这是内存中的图像对象
        const imageRef = await context.renderAsync();

        // 4. 保存 (Save) - 在这里配置压缩率和格式
        const result = await imageRef.saveAsync({
            compress: 0.7, // 压缩率
            format: SaveFormat.JPEG, // 格式
        });

        // result 包含 { uri, width, height }
        return result;
    } catch (error) {
        console.error('Image compression failed:', error);
        throw error;
    }
};
