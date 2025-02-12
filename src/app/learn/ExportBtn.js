
export default function ExportButton({words}) {
  const handleExport = () => {
    // 示例文本内容
    const content = words.map((word=>word.word+'  '+word.translations.toString()+word.pronunciation+'\n'+word.sentence)).join('\n');
    console.log(content,'content')
    // 创建 Blob 对象
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "导出文档.txt"; // 设置下载文件名
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
        className="mr-2 md:mr-3 flex flex-col flex-0 cursor-pointer justify-center py-4 text-xs font-semibold leading-none text-white transition duration-300 rounded-lg bg-blue-300 hover:bg-blue-400"
        onClick={handleExport}
    >
    <div className="flex flex-col justify-center items-center select-none">
    <div className="text-lg">export all words</div>
    </div>
    </div>
  );
}