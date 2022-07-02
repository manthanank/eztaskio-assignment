export class FileUpload {
    key: any;
    name: any;
    url: any;
    file: File;
    constructor(file: File) {
        this.file = file;
    }
}