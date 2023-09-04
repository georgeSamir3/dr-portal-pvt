export function isPdfFile(src) {
    const pattern = /.+.pdf$/;
    return pattern.test(src);
}