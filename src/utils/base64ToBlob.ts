export function base64ToBlob(code: string | undefined) {
    //Base64一行不能超过76字符，超过则添加回车换行符。因此需要把base64字段中的换行符，回车符给去掉，有时候因为存在需要把加号空格之类的换回来，取决于base64存取时的规则。
    code = code.replace(/[\n\r]/g, '');
    var raw = window.atob(code);
    let rawLength = raw.length;
    //转换成pdf.js能直接解析的Uint8Array类型
    let uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: 'application/pdf'});//转成pdf类型
}