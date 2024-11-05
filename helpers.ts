export function convertBase64(blob: Blob){
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(blob);
  
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
  
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

export function getCookie(cname: string) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}