## readText() - 读取剪贴板中的纯文本

```javascript
// 异步读取剪贴板中的文本
navigator.clipboard
  .readText()
  .then((text) => {
    console.log('剪贴板内容:', text)
  })
  .catch((err) => {
    console.error('读取失败:', err)
  })

// 使用 async/await
async function getClipboardText() {
  try {
    const text = await navigator.clipboard.readText()
    return text
  } catch (err) {
    console.error('读取剪贴板失败:', err)
    return ''
  }
}
```

## writeText() - 写入剪贴板中的纯文本

```javascript
// 复制文本到剪贴板
navigator.clipboard
  .writeText('要复制的文本')
  .then(() => {
    console.log('复制成功')
  })
  .catch((err) => {
    console.error('复制失败:', err)
  })

// 实际应用：复制当前URL
function copyCurrentURL() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      alert('链接已复制到剪贴板')
    })
    .catch((err) => {
      console.error('复制失败:', err)
    })
}
```

## read() - 读取剪贴板中的多种格式数据

```javascript
// 读取剪贴板中的所有数据格式
navigator.clipboard
  .read()
  .then((clipboardItems) => {
    // clipboardItems 是一个 ClipboardItem 对象的数组
    for (const clipboardItem of clipboardItems) {
      // 遍历支持的所有格式
      for (const type of clipboardItem.types) {
        // 获取特定格式的数据
        clipboardItem.getType(type).then((blob) => {
          console.log(`类型: ${type}`)

          if (type.startsWith('text/')) {
            // 处理文本数据
            blob.text().then((text) => {
              console.log('文本内容:', text)
            })
          } else if (type.startsWith('image/')) {
            // 处理图片数据
            const img = document.createElement('img')
            img.src = URL.createObjectURL(blob)
            document.body.appendChild(img)
          }
        })
      }
    }
  })
  .catch((err) => {
    console.error('读取剪贴板失败:', err)
  })
```

## write() - 写入多种格式数据到剪贴板

```javascript
// 写入多种格式的数据
async function copyRichContent() {
  // 创建文本和HTML两种格式
  const text = '这是纯文本';
  const html = '<b>这是HTML文本</b>';
  
  const textBlob = new Blob([text], { type: 'text/plain' });
  const htmlBlob = new Blob([html], { type: 'text/html' });
  
  // 创建 ClipboardItem
  const clipboardItem = new ClipboardItem({
    'text/plain': textBlob,
    'text/html': htmlBlob,
  });
  
  try {
    await navigator.clipboard.write([clipboardItem]);
    console.log('富文本内容已复制');
  } catch (err) {
    console.error('复制失败:', err);
  }
}

// 复制图片到剪贴板
async function copyImageToClipboard(canvasElement) {
  canvasElement.toBlob(async (blob) => {
    const clipboardItem = new ClipboardItem({
      'image/png': blob
    });
    
    try {
      await navigator.clipboard.write([clipboardItem]);
      console.log('图片已复制到剪贴板');
    } catch (err) {
      console.error('复制图片失败:', err);
    }
  });
}
```

## ClipboardItem 类

这是 read() 和 write() 方法中使用的核心类：

```javascript
// 创建 ClipboardItem
const clipboardItem = new ClipboardItem({
  'text/plain': blob,  // 纯文本格式
  'text/html': blob,   // HTML格式
  'image/png': blob,   // 图片格式
  // 可以添加多种格式
});

// ClipboardItem 的属性和方法
console.log(clipboardItem.types); // 支持的格式数组 ['text/plain', 'text/html']

// 获取特定格式的数据
clipboardItem.getType('text/plain')
  .then(blob => {
    return blob.text();
  })
  .then(text => {
    console.log('纯文本内容:', text);
  });
```

## 权限 API 配合使用
```javascript
// 检查剪贴板读取权限
async function checkClipboardPermission() {
  try {
    const permissionStatus = await navigator.permissions.query({
      name: 'clipboard-read',
      // allowWithoutGesture: false  // 是否需要手势
    });
    
    console.log('剪贴板读取权限状态:', permissionStatus.state);
    
    permissionStatus.onchange = () => {
      console.log('权限状态变化为:', permissionStatus.state);
    };
    
    return permissionStatus.state;
  } catch (err) {
    console.error('检查权限失败:', err);
    return 'unknown';
  }
}

// 检查写入权限
async function checkClipboardWritePermission() {
  try {
    const permissionStatus = await navigator.permissions.query({
      name: 'clipboard-write',
    });
    
    return permissionStatus.state;
  } catch (err) {
    return 'unknown';
  }
}
```
## 实际应用示例

### 不允许复制

有一些场景，我们不允许用户直接复制我们的内容，比如：未登录、未开会员等情况，这时我们可以使用如下方法,通过监听 copy 事件，阻止浏览器的默认复制行为，并使用 navigator.clipboard.writeText()写入我们告诉用户的内容

```javascript
document.addEventListener('copy', (e) => {
  e.preventDefault()
  navigator.clipboard.writeText('不允许复制')
})
```

### 复制内容后添加版权信息

我们可以使用如下方法，在用户复制内容后，添加版权信息

```html
<input type="text" class="txt" />
<button class="btn">复制</button>
```

```javascript
const btn = document.querySelector('.btn')
const txt = document.querySelector('.txt')
btn.addEventListener('click', () => {
  navigator.clipboard.writeText(txt.value + '版权信息')
})
```

### 获取剪切板内容

有时当我们点击复制，进入某个 app，或者网页的时候，该应用会将剪切板内容进行解析，进行一些系统操作，他们就是利用了 navigator.clipboard.readText()方法获取剪切板内容：

```javascript
navigator.clipboard.readText().then((text) => {})
```

### 容器可以粘贴图片

有时我们需要一个容器，用户可以粘贴图片，这时我们可以使用如下方法，通过监听 paste（粘贴）事件，使用 e.clipboardData.files 获取文件
<br>contenteditable 是一个 HTML 全局属性，用于使任何 HTML 元素的内容可以直接在页面上被用户编辑。

```html
<div class="editor" contenteditable></div>
```

```javascript
const editor = document.querySelector('.editor')
document.addEventListener('paste', function (e) {
  if (e.clipboardData.files.length > 0) {
    e.preventDefault()
    const file = e.clipboardData.files[0] // 获取用户选择的第一个文件
    const reader = new FileReader() // 创建 FileReader 对象
    reader.onload = function (e) {
      // 当读取完成时，e.target.result 就是文件的 Data URL
      const img = document.createElement('img')
      img.src = e.target.result
      editor.appendChild(img)
    }
    reader.readAsDataURL(file) // 开始读取文件
  }
})
```
